/**
 * ImageKit media config.
 * Endpoint: https://ik.imagekit.io/f7h9cj23x
 * Folder: /Labs/
 */
export const IMAGEKIT_BASE_URL = 'https://ik.imagekit.io/f7h9cj23x';

const folder = 'Labs';

function ik(fileName: string): string {
  return `${IMAGEKIT_BASE_URL}/${folder}/${fileName}`;
}

/** Remote video URLs hosted on ImageKit */
export const ImageKitVideos = {
  lessonOne: ik('lesson-one-demo.mp4'),
  lessonTwo: ik('lesson-two-demo.mp4'),
  lessonThree: ik('lesson-three-demo.mp4'),
  virtualLab: ik('virtual-lab-demo.mp4'),
} as const;
