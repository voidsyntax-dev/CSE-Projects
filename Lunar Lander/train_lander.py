# Lunar Lander (continuous): final run with early stopping
#
# Continues from `ppo_lunar_distfocus` (best 200-seed model so far) with the shaped reward:
#   - per-step penalty for horizontal distance from x = 0 (dist_coef = 1.0)
#   - built-in fuel cost reduced to 20% (keep_fuel = 0.2)
#   - touchdown bonus that is largest at x = 0 (centre_bonus = 150)
#
# Up to 1M extra steps, checked every 50k steps on the plain environment.
# Training stops early if the score stops improving. The best checkpoint is saved separately.
#
# Setup (run once in a shell, not in Python):
#   apt-get -qq install -y swig
#   pip install -q 'gymnasium[box2d]' stable-baselines3 imageio imageio-ffmpeg

# %% Imports
import warnings, os
warnings.filterwarnings('ignore')

import numpy as np
import imageio
import gymnasium as gym
from stable_baselines3 import PPO
from stable_baselines3.common.monitor import Monitor
from stable_baselines3.common.callbacks import EvalCallback, StopTrainingOnNoModelImprovement


# %% Shaped reward wrapper
# The environment itself is unchanged. Only the reward used for training is shaped.

class CentredLander(gym.Wrapper):
    def __init__(self, env, dist_coef=1.0, keep_fuel=0.2, centre_bonus=150.0):
        super().__init__(env)
        self.dist_coef = dist_coef
        self.keep_fuel = keep_fuel
        self.centre_bonus = centre_bonus

    def step(self, action):
        obs, reward, terminated, truncated, info = self.env.step(action)
        x = float(obs[0])
        shaped = reward

        # Refund part of the built-in fuel cost (main 0.3, side 0.03 per frame)
        a0, a1 = float(action[0]), float(action[1])
        m_power = (np.clip(a0, 0.0, 1.0) + 1.0) * 0.5 if a0 > 0.0 else 0.0
        s_power = np.clip(abs(a1), 0.5, 1.0) if abs(a1) > 0.5 else 0.0
        builtin_fuel = 0.3 * m_power + 0.03 * s_power
        shaped += (1.0 - self.keep_fuel) * builtin_fuel

        # Distance from x = 0, every step
        shaped -= self.dist_coef * abs(x)

        # Touchdown bonus, largest at x = 0, zero beyond |x| = 0.1
        if terminated and reward > 0:
            closeness = max(0.0, 1.0 - abs(x) / 0.1)
            shaped += self.centre_bonus * closeness

        return obs, shaped, terminated, truncated, info


# %% Train up to 1M steps with early stopping

train_env = CentredLander(gym.make('LunarLander-v3', continuous=True))
eval_env = Monitor(gym.make('LunarLander-v3', continuous=True))

stop_cb = StopTrainingOnNoModelImprovement(max_no_improvement_evals=5, min_evals=4, verbose=1)
eval_cb = EvalCallback(
    eval_env,
    eval_freq=50_000,
    n_eval_episodes=20,
    best_model_save_path='best_final',
    callback_after_eval=stop_cb,
    deterministic=True,
    verbose=1,
)

model = PPO.load('ppo_lunar_distfocus', env=train_env)
model.learn(total_timesteps=1_000_000, reset_num_timesteps=False, callback=eval_cb)
model.save('ppo_lunar_final')
train_env.close()
eval_env.close()
print('saved ppo_lunar_final and best_final/best_model.zip')


# %% Evaluate on the plain environment
# Same metrics as before, on 200 seeds, for both the final model and the best checkpoint.

def evaluate(path, n_seeds=200):
    model = PPO.load(path)
    env = gym.make('LunarLander-v3', continuous=True)
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
        landed = obs[6] and obs[7] and r > 0
        if landed and x < 0.2:
            on_pad += 1
        if landed and x < 0.05:
            on_centre += 1
    env.close()
    print(f'--- {path} ({n_seeds} seeds) ---')
    print(f'mean reward {np.mean(rewards):.1f} +/- {np.std(rewards):.1f}')
    print(f'solved (>=200): {np.mean(np.array(rewards) >= 200):.0%}')
    print(f'landed on pad (|x|<0.2): {on_pad}/{n_seeds}')
    print(f'landed on centre (|x|<0.05): {on_centre}/{n_seeds}')
    print(f'median |x| at landing: {np.median(offsets):.3f}')
    print(f'mean fuel per episode: {np.mean(fuels):.1f}\n')
    return model

evaluate('best_final/best_model')
evaluate('ppo_lunar_final')


# %% Record one landing from the best checkpoint

model = PPO.load('best_final/best_model')
env = gym.make('LunarLander-v3', continuous=True, render_mode='rgb_array')
frames = []
obs, _ = env.reset(seed=0)
done = False
while not done:
    action, _ = model.predict(obs, deterministic=True)
    obs, r, terminated, truncated, _ = env.step(action)
    frames.append(env.render())
    done = terminated or truncated
env.close()

os.makedirs('videos', exist_ok=True)
imageio.mimsave('videos/final_landing.mp4', frames, fps=50, macro_block_size=1)
print('saved videos/final_landing.mp4')
