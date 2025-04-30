// Sound file paths
export const SOUNDS = {
  CLICK: '/sounds/click.mp3',
  COOKING_START: '/sounds/cooking_start.wav',
  COOKING_COMPLETE: '/sounds/cooking_complete.mp3',
  CUSTOMER_ARRIVE: '/sounds/customer_arrive.mp3',
  CUSTOMER_SERVED: '/sounds/customer_served.wav',
  RUSH_HOUR: '/sounds/rush_hour.mp3',
  INGREDIENT_DROP: '/sounds/ingredient_drop.mp3',
  BACKGROUND_MUSIC: '/sounds/background_music.mp3',
};

// This map will cache audio objects so we don't need to reload them
const audioCache: { [key: string]: HTMLAudioElement } = {};

/**
 * Play a sound effect
 * @param soundPath Path to the sound file
 * @param volume Volume level (0-1)
 * @param loop Whether to loop the sound
 * @returns The audio element
 */
export const playSound = (soundPath: string, volume = 1.0, loop = false): HTMLAudioElement | null => {
  try {
    // Check if we already have this audio loaded
    let audio = audioCache[soundPath];
    
    if (!audio) {
      audio = new Audio(soundPath);
      audioCache[soundPath] = audio;
    }
    
    // Reset audio if it was already playing
    audio.pause();
    audio.currentTime = 0;
    
    // Set properties
    audio.volume = volume;
    audio.loop = loop;
    
    // Play the sound
    audio.play().catch(error => {
      console.error('Error playing sound:', error);
    });
    
    return audio;
  } catch (error) {
    console.error('Error creating audio:', error);
    return null;
  }
};

/**
 * Stop a sound that's currently playing
 * @param soundPath Path to the sound file
 */
export const stopSound = (soundPath: string): void => {
  const audio = audioCache[soundPath];
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
};

/**
 * Set the mute state for all audio
 * @param muted Whether audio should be muted
 */
export const setMuted = (muted: boolean): void => {
  Object.values(audioCache).forEach(audio => {
    audio.muted = muted;
  });
};

// Background music control
let backgroundMusic: HTMLAudioElement | null = null;

/**
 * Start playing background music
 */
export const startBackgroundMusic = (): void => {
  if (!backgroundMusic) {
    backgroundMusic = playSound(SOUNDS.BACKGROUND_MUSIC, 0.3, true);
  } else if (backgroundMusic.paused) {
    backgroundMusic.play().catch(console.error);
  }
};

/**
 * Pause the background music
 */
export const pauseBackgroundMusic = (): void => {
  if (backgroundMusic) {
    backgroundMusic.pause();
  }
}; 