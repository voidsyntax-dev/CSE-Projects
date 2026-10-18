# Lunar Lander (Continuous): Centred Landings with PPO and Reward Shaping

This project trains a Proximal Policy Optimization (PPO) agent on Gymnasium's continuous `LunarLander-v3`. A custom reward-shaping wrapper pushes the lander to touch down at the exact centre of the landing pad, not just anywhere between the flags.

The shaping applies only during training. Every score reported here comes from the unmodified environment, so the numbers are directly comparable with standard LunarLander benchmarks.

## Highlights

| | Best checkpoint (750k steps) | Final model (~1M steps) |
|---|---|---|
| Mean reward, 200 seeds, calm | 217.5 ± 75.7 | 222.0 ± 69.5 |
| Episodes scoring ≥ 200 | 84% | 85% |
| Landed on pad (\|x\| < 0.2) | 99 / 200 (49.5%) | 88 / 200 (44%) |
| Landed on centre (\|x\| < 0.05) | 18 / 200 (9%) | 20 / 200 (10%) |
| Median final \|x\| | 0.179 | 0.205 |
| Solved rate in strong wind (15) | 65% | 61% |
| Pad landings in strong wind (15) | 82 / 200 | 62 / 200 |

Both models solve the environment on average.

- **Best checkpoint:** more positionally precise, and it degrades more gracefully in wind, although neither model was trained with wind.
- **Final model:** a marginally higher reward in calm conditions.
- **Centring goal:** only partly achieved. About half of all episodes end with a landing on the pad, and about one in ten on the centre.

## Getting started

### Requirements

The notebook was run on a CUDA GPU runtime. The notebook metadata reports Python 3.13. Dependencies are installed unpinned.

Box2D must be compiled, which needs SWIG:

```bash
# Debian/Ubuntu. On other platforms, install SWIG with brew, choco, conda, etc.
sudo apt-get install -y swig
pip install "gymnasium[box2d]" stable-baselines3 imageio imageio-ffmpeg
```

PyTorch is pulled in by `stable-baselines3`. A GPU is optional. PPO with a small MLP policy often runs just as fast on CPU (see [Known issues and caveats](#known-issues-and-caveats)).

### Running the notebook

Open `Lunar Lander PPO.ipynb` and run the cells in order. They cover:

1. Dependency install
2. Imports
3. The `CentredLander` wrapper
4. Training
5. Evaluation of both saved models
6. Video recording
7. The wind robustness test

On the original hardware, training took about 39 minutes, evaluation about 1.5 minutes, and the robustness test about 6.5 minutes.

> **Note:** The robustness cell needs an updated `evaluate()` function before it will run. A drop-in replacement is given in [Known issues and caveats](#known-issues-and-caveats).

### Using the trained models

```python
import gymnasium as gym
from stable_baselines3 import PPO

model = PPO.load("best_final/best_model")          # or "ppo_lunar_final"
env = gym.make("LunarLander-v3", continuous=True, render_mode="human")

obs, _ = env.reset(seed=0)
done = False
while not done:
    action, _ = model.predict(obs, deterministic=True)
    obs, reward, terminated, truncated, _ = env.step(action)
    done = terminated or truncated
env.close()
```

### Training with the shaping wrapper

```python
train_env = CentredLander(
    gym.make("LunarLander-v3", continuous=True),
    dist_coef=1.0, keep_fuel=0.2, centre_bonus=150.0,
)
model = PPO("MlpPolicy", train_env, seed=0, verbose=1)
model.learn(total_timesteps=1_000_000)
```

Always evaluate on a plain `gym.make("LunarLander-v3", continuous=True)` environment. Scores obtained with the wrapper are not comparable to standard results.

## Project structure

```
.
├── Lunar Lander PPO.ipynb     # full pipeline: wrapper, training, evaluation, video, robustness
├── best_final/
│   └── best_model.zip         # best checkpoint selected by EvalCallback (750k steps)
├── ppo_lunar_final.zip        # model at the end of training (1,001,472 steps)
```

## The environment

`LunarLander-v3` with `continuous=True` is a Box2D rocket-landing task. The lander starts near the top of the screen with a random initial push and must come to rest on a flat pad between two flags. The pad sits at the horizontal centre of the world, which corresponds to x = 0 in the observation. The flags are at x = ±0.2 in normalised coordinates.

### Observations

| Index | Meaning |
|---|---|
| 0 | Horizontal position x, normalised; 0 is the pad centre and ±0.2 are the flags |
| 1 | Vertical position y, relative to the pad |
| 2, 3 | Horizontal and vertical velocity |
| 4 | Body angle |
| 5 | Angular velocity |
| 6, 7 | Left and right leg ground contact (1 or 0) |

### Actions

There are two continuous actions, each in [-1, 1].

| Action | Behaviour |
|---|---|
| Main engine | Off for values ≤ 0. Over (0, 1], throttle scales from 50% to 100%. |
| Side boosters | Off while the absolute value is ≤ 0.5. Above that, one side booster fires, with throttle scaling from 50% to 100%. The sign picks which side. |

### Built-in reward

| Source | Reward |
|---|---|
| Moving closer to the pad, slowing down, staying upright | Positive, via a potential-based shaping term |
| Each leg in ground contact | +10 |
| Main engine, per frame | −0.3, scaled by throttle |
| Side booster, per frame | −0.03, scaled by throttle |
| Crash, or flying out of bounds | −100, and the episode ends |
| Coming to rest | +100, and the episode ends |

Episodes are truncated at 1000 steps. A return of 200 or more counts as solving an episode.

The built-in distance term already gives a mild centring incentive: coming to rest at the flag edge is worth about 20 points less than resting on the centre line. This project strengthens that incentive substantially.

## Reward shaping

The `CentredLander` class is a `gym.Wrapper` that changes only the reward returned by `step()`. Observations, physics, and termination are untouched.

```
r_shaped = r_env
         + (1 - keep_fuel) * (0.30 * m_power + 0.03 * s_power)    # fuel refund, every step
         - dist_coef * |x|                                        # off-centre penalty, every step
         + centre_bonus * max(0, 1 - |x| / 0.1)                   # touchdown bonus, successful landings only
```

| Parameter | Value | Effect |
|---|---|---|
| `dist_coef` | 1.0 | Every step costs \|x\|, in flight and on the ground |
| `keep_fuel` | 0.2 | The agent pays 20% of the normal fuel price; 80% is refunded |
| `centre_bonus` | 150 | Up to +150 for coming to rest at x = 0 |

### Fuel refund

The wrapper recomputes engine power exactly as Gymnasium does:

- **Main engine:** `m_power = (clip(a0, 0, 1) + 1) / 2` when `a0 > 0`.
- **Side boosters:** `s_power = clip(|a1|, 0.5, 1)` when `|a1| > 0.5`.

It then adds back 80% of the resulting fuel cost.

Centring needs extra lateral corrections. A cheaper fuel price removes the incentive to accept wherever the lander happens to drift. Evaluation uses the plain environment, so the reported scores still pay the full fuel price.

### Off-centre penalty

Every step costs `dist_coef * |x|`. This shapes the whole descent, not just the touchdown. At a typical offset of 0.2 over a 300-step episode, the penalty adds up to about −60.

The term is not potential-based, so it deliberately changes the optimal policy. One side effect is that it rewards shorter episodes when the lander is off-centre. In principle, it can make ending an episode early, even by crashing, look less costly when the lander has drifted far from the centre line.

### Touchdown bonus

The bonus is paid once, on the terminating step, only when the raw environment reward on that step is positive. The environment sets that reward to exactly +100 when the lander comes to rest and −100 on a crash, so the bonus pays only for successful landings.

The bonus is a linear tent:

| \|x\| at rest | Bonus |
|---|---|
| 0 | +150 |
| 0.05 | +75 |
| 0.1 or more | 0 |

The bonus therefore covers only the inner half of the pad.

## Training setup

All PPO hyperparameters are Stable-Baselines3 defaults; none were tuned.

| Setting | Value |
|---|---|
| Algorithm | PPO (Stable-Baselines3), `MlpPolicy` |
| Networks | Separate actor and critic, each with two hidden layers of 64 units, tanh activations |
| Learning rate | 3e-4, constant |
| Rollout length (`n_steps`) | 2048 |
| Minibatch size | 64 |
| Epochs per update | 10 |
| Discount γ / GAE λ | 0.99 / 0.95 |
| Clip range | 0.2 |
| Entropy coefficient | 0.0 |
| Parallel environments | 1 (`DummyVecEnv`) |
| Seed | 0 |
| Timestep budget | 1,000,000 (1,001,472 actual, i.e. 489 rollouts × 2048) |
| Device | CUDA |

### Callbacks

| Callback | Configuration |
|---|---|
| `EvalCallback` | Every 50,000 steps, runs 20 deterministic episodes on the plain environment. Saves the best model to `best_final/best_model.zip`. |
| `StopTrainingOnNoModelImprovement` | `max_no_improvement_evals=5`, `min_evals=4` |

**Early stopping:** training stops once the best evaluation score has failed to improve for more than five consecutive evaluations. Counting starts only after the first four evaluations.

In the recorded run, early stopping never triggered:

- The longest streaks without improvement were exactly five evaluations: 450k–650k, and again 800k–1M.
- A new best at 700k reset the first streak.
- The second streak was still running when the timestep budget ran out.

**Training logs:** Stable-Baselines3 automatically wraps the training environment in a `Monitor`, outside the shaping wrapper. The `rollout/ep_rew_mean` value in the logs is therefore the shaped return. It cannot be compared with `eval/mean_reward`, which is measured on the plain environment.

## Training progress

Evaluation results logged during training (20 episodes each, plain environment, deterministic actions):

| Step | Mean reward ± std | Mean episode length | Note |
|---|---|---|---|
| 50k | −593.19 ± 82.70 | 986 | new best |
| 100k | 60.07 ± 112.38 | 777 | new best |
| 150k | 95.48 ± 102.03 | 566 | new best |
| 200k | 199.77 ± 65.36 | 442 | new best |
| 250k | 182.31 ± 78.86 | 409 | |
| 300k | 177.89 ± 86.15 | 484 | |
| 350k | 217.48 ± 51.59 | 414 | new best |
| 400k | 237.45 ± 55.91 | 314 | new best |
| 450k | 223.69 ± 45.15 | 297 | |
| 500k | 235.60 ± 44.92 | 274 | |
| 550k | 215.76 ± 72.80 | 324 | |
| 600k | 223.76 ± 57.91 | 295 | |
| 650k | 214.98 ± 87.61 | 284 | |
| 700k | 243.73 ± 17.58 | 288 | new best |
| 750k | 247.31 ± 20.10 | 289 | **new best, saved checkpoint** |
| 800k | 229.33 ± 70.33 | 286 | |
| 850k | 226.67 ± 54.31 | 291 | |
| 900k | 223.90 ± 76.96 | 241 | |
| 950k | 215.02 ± 79.95 | 254 | |
| 1000k | 232.79 ± 53.38 | 287 | final model |

The run has three phases.

1. **Hovering (roughly the first 150k steps).** The agent learns to stay airborne instead of crashing. The mean training episode length rises from about 110 to about 850 steps. The 50k evaluation runs almost to the 1000-step limit and scores −593, because the plain environment charges the full fuel price for all that thrust. Hovering is a common LunarLander phase, and the reduced training fuel price makes it even cheaper.
2. **Committing to landings (about 100k–200k steps).** The agent learns to touch down. Episode lengths fall, and the evaluation mean reaches about 200 by 200k steps.
3. **Plateau (from about 350k steps).** The evaluation score stays between 215 and 247. Mean episode length keeps falling, from 414 to about 290, as descents become more decisive.

Over the run:

- The shaped training return rises from −325 to about 200.
- The policy's action standard deviation shrinks from 1.0 to 0.19. Around 760k steps, `entropy_loss` turns positive. This is expected for a Gaussian policy with a small standard deviation (its entropy becomes negative) and does not indicate a bug.

Training throughput was about 420 steps per second, for a wall-clock time of about 39 minutes (2,361 s) including evaluation pauses.

## Evaluation method

Both saved models were evaluated on 200 fixed seeds (0–199) on the unmodified environment, with deterministic actions.

| Metric | How it is computed | Caveat |
|---|---|---|
| Mean reward ± std | Sum of plain-environment rewards per episode | |
| Solved | Fraction of episodes with a return of 200 or more | |
| Landed on pad | Both legs touching on the final step, a positive final-step reward, and \|x\| < 0.2 | Heuristic landing check (see caveats) |
| Landed on centre | Same check, with \|x\| < 0.05 | |
| Median \|x\| | Median of \|x\| on the final step | Taken over all episodes, including crashes and timeouts, not only landings |
| Fuel | Mean over episodes of the per-step sum of \|a0\| + \|a1\| | A proxy for control effort. Engines are off for a0 ≤ 0 and \|a1\| ≤ 0.5, so this is not actual engine fuel. |

**Robustness test:** the same procedure, with `enable_wind=True` and `wind_power` set to 5, 10, and 15. Gymnasium allows values up to 20; `turbulence_power` stays at its default of 1.5. Neither model saw wind during training.

## Results

### Calm conditions

| Model | Mean reward | Solved | Pad | Centre | Median \|x\| | Fuel |
|---|---|---|---|---|---|---|
| Best checkpoint (750k) | 217.5 ± 75.7 | 84% | 99/200 | 18/200 | 0.179 | 311.6 |
| Final model (~1M) | 222.0 ± 69.5 | 85% | 88/200 | 20/200 | 0.205 | 295.7 |

### Robustness to wind

**Best checkpoint**

| Condition | Mean reward | Solved | Pad | Centre | Median \|x\| | Fuel |
|---|---|---|---|---|---|---|
| Calm | 217.5 ± 75.7 | 84% | 99/200 | 18/200 | 0.179 | 311.6 |
| Wind 5 | 216.8 ± 76.1 | 84% | 95/200 | 24/200 | 0.191 | 340.1 |
| Wind 10 | 197.0 ± 99.5 | 72% | 90/200 | 16/200 | 0.188 | 328.8 |
| Wind 15 | 185.7 ± 108.9 | 65% | 82/200 | 20/200 | 0.190 | 365.1 |

**Final model**

| Condition | Mean reward | Solved | Pad | Centre | Median \|x\| | Fuel |
|---|---|---|---|---|---|---|
| Calm | 222.0 ± 69.5 | 85% | 88/200 | 20/200 | 0.205 | 295.7 |
| Wind 5 | 208.2 ± 87.4 | 79% | 77/200 | 18/200 | 0.226 | 314.2 |
| Wind 10 | 205.0 ± 94.3 | 78% | 74/200 | 17/200 | 0.244 | 304.0 |
| Wind 15 | 182.6 ± 109.8 | 61% | 62/200 | 11/200 | 0.299 | 300.3 |

### Key findings

**The task is solved.** Both models average above 200 in calm conditions, and 84–85% of individual episodes clear the threshold.

**Centring is only partly achieved.** About half of all episodes end with a landing on the pad, and roughly one in ten on the centre. The median final offset of 0.18–0.21 sits close to the flag edge at 0.2. The touchdown bonus pays only inside \|x\| < 0.1, and many landings fall outside that band. The bonus is therefore probably too sparse to dominate the agent's behaviour.

**In calm conditions, the two models are hard to separate.** The reward gap of 4.5 points is smaller than the standard error of either mean, which is about 5. The pad-landing gap of 99 versus 88 is suggestive but also within noise for a single training run.

**Wind makes the difference clearer.**

- **Precision:** the best checkpoint holds its median offset at about 0.19 at every wind level and loses 17 pad landings from calm to wind 15. The final model drifts from 0.205 to 0.299 and loses 26.
- **Control effort:** the best checkpoint's control effort rises from 311.6 to 365.1 as the wind gets stronger. The final model's effort stays near 300. This suggests the best checkpoint actively counters the wind, while the final model lets the wind push it.
- **Reward:** neither model dominates. The final model scores slightly higher at wind 10, while the best checkpoint is ahead at wind 5 and wind 15.

**Checkpoint selection is optimistic.** The best checkpoint scored 247.3 ± 20.1 on the 20 evaluation episodes that selected it, but 217.5 on 200 seeds. Selecting the maximum of many noisy 20-episode estimates inflates the reported score.

## Demo video

`videos/final_landing.mp4` shows the best checkpoint landing on seed 0, recorded at 50 fps.

GitHub READMEs can't play MP4 files inline. To embed the landing in this page, convert it to a GIF:

```bash
ffmpeg -i videos/final_landing.mp4 -vf "fps=25,scale=400:-1" videos/final_landing.gif
```

Then add `![Landing demo](videos/final_landing.gif)` to this README.

## Known issues and caveats

| Issue | Details and fix |
|---|---|
| The robustness cell fails as saved | It calls `evaluate(path, enable_wind=..., wind_power=...)` and reads a dict (`r['mean']`, `r['pad']`, ...). The saved `evaluate()` accepts only `path` and `n_seeds`, prints its results, and returns the model. The execution counter jumps from 6 to 9, so the matching version was in cells that were later deleted. Use the drop-in replacement below. |
| The notebook intro is out of date | The intro mentions "up to 1M extra steps", but training starts from a fresh model. `reset_num_timesteps=False` is a leftover that has no effect on a new model. Update the markdown and drop the argument. |
| "Median \|x\| at landing" is misnamed | It is computed over all episodes, not just landings. Rename it to "median final \|x\|", or filter to landed episodes. |
| "Fuel" is not real fuel | It sums absolute action values, including the dead zones where engines don't fire. To measure real fuel, compute `m_power` and `s_power` the same way the wrapper does. |
| Landing detection is a heuristic | The check uses leg contact plus a positive last-step reward. A timed-out episode resting on its legs could be counted as a landing. A stricter check is `terminated and r > 0`, since the environment returns exactly +100 when the lander comes to rest. |
| Checkpoint selection is noisy | The best model is chosen from 20 episodes per evaluation. Raise `n_eval_episodes` to 50–100 for a more reliable selection. |
| Training logs show the shaped reward | `rollout/ep_rew_mean` is the shaped return. To compare with evaluation, also log the raw reward, for example through the `info` dict. |
| Results come from one run | Only seed 0 was trained. Variance across training seeds is unknown. |
| GPU for a small MLP | Stable-Baselines3 PPO with `MlpPolicy` is primarily meant for CPU, and `device="cpu"` is often as fast or faster. |
| Unpinned dependencies | Pin versions, for example with `pip freeze > requirements.txt`, for reproducibility. |

### Drop-in `evaluate()` replacement

This version keeps the original metric definitions, so it reproduces the numbers above. It works for both the calm evaluation cell and the robustness cell. Pass `verbose=False` in the robustness loop for compact output.

```python
def evaluate(path, n_seeds=200, verbose=True, **env_kwargs):
    """Evaluate a saved PPO model on the plain environment.

    Extra keyword arguments (e.g. enable_wind=True, wind_power=10.0) go to gym.make.
    Returns a dict of metrics and prints a summary when verbose=True.
    """
    model = PPO.load(path)
    env = gym.make('LunarLander-v3', continuous=True, **env_kwargs)
    rewards, fuels, offsets = [], [], []
    on_pad, on_centre = 0, 0
    for seed in range(n_seeds):
        obs, _ = env.reset(seed=seed)
        done, total, fuel, r = False, 0.0, 0.0, 0.0
        while not done:
            action, _ = model.predict(obs, deterministic=True)
            fuel += abs(float(action[0])) + abs(float(action[1]))
            obs, r, terminated, truncated, _ = env.step(action)
            total += r
            done = terminated or truncated
        rewards.append(total)
        fuels.append(fuel)
        x = abs(float(obs[0]))
        offsets.append(x)
        landed = bool(obs[6] and obs[7] and r > 0)
        on_pad += int(landed and x < 0.2)
        on_centre += int(landed and x < 0.05)
    env.close()

    res = {
        'mean': float(np.mean(rewards)),
        'std': float(np.std(rewards)),
        'solved': float(np.mean(np.array(rewards) >= 200)),
        'pad': on_pad,
        'centre': on_centre,
        'median_x': float(np.median(offsets)),
        'fuel': float(np.mean(fuels)),
    }
    if verbose:
        print(f'--- {path} ({n_seeds} seeds) ---')
        print(f"mean reward {res['mean']:.1f} +/- {res['std']:.1f}")
        print(f"solved (>=200): {res['solved']:.0%}")
        print(f'landed on pad (|x|<0.2): {on_pad}/{n_seeds}')
        print(f'landed on centre (|x|<0.05): {on_centre}/{n_seeds}')
        print(f"median |x| at episode end: {res['median_x']:.3f}")
        print(f"mean fuel per episode: {res['fuel']:.1f}\n")
    return res
```

## Ideas for future work

**Train with wind.** The models already cope reasonably well with wind they never saw, so domain randomisation (random `wind_power` per episode) is a natural next step.

**Reshape the centring incentive.** The current bonus covers only the inner half of the pad and is often missed entirely. Options include widening the bonus to the full pad, using a smooth Gaussian bonus, or scaling the per-step distance penalty with proximity to the ground. A small sweep over `dist_coef`, `keep_fuel`, and `centre_bonus` would show which term actually drives behaviour. Logging each shaping component separately through the `info` dict would help with this.

**Make comparisons more rigorous.** Train several seeds and report confidence intervals. Store per-seed evaluation results so models can be compared with paired tests on identical seeds.

**Speed up training.** Use 8–16 vectorised environments on CPU, try learning-rate annealing, and use a larger evaluation set for checkpoint selection.
