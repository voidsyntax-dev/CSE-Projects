import numpy as np
import gymnasium as gym
from gymnasium.utils.play import play

env = gym.make("LunarLander-v3", continuous=True, render_mode="rgb_array")
play(env,
     keys_to_action={
         "w":  np.array([1.0, 0.0], dtype=np.float32),
         "a":  np.array([0.0, -1.0], dtype=np.float32),
         "d":  np.array([0.0, 1.0], dtype=np.float32),
         "wa": np.array([1.0, -1.0], dtype=np.float32),
         "wd": np.array([1.0, 1.0], dtype=np.float32),
     },
     noop=np.array([0.0, 0.0], dtype=np.float32),
     fps=30)