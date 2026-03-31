window.ExperimentConfig = {
  app: {
    name: "NEUROSYNC Platform",
    version: "1.0.0",
    studyTitle:
      "NEUROSYNC: Multimodal Auditory Stimulation Under Chromatic Ambient Lighting",
    repositoryVisibilityNote:
      "This static app is suitable for repository-based publication and archiving under the NEUROSYNC project.",
  },
  routes: {
    start: "index.html",
    surveyBaseline: "survey1.html",
    acclimation: "acclimation.html",
    baseline: "baseline.html",
    task1: "task1.html",
    surveyPostTask1: "survey2_1.html",
    task2: "task2.html",
    surveyPostTask2: "survey2_2.html",
    finish: "finish.html",
  },
  timings: {
    surveyBaselineIntroSeconds: 10,
    surveyBaselineFormSeconds: 120,
    acclimationSeconds: 150,
    baselineSeconds: 300,
    taskItemSeconds: 60,
    surveyPostTaskIntroSeconds: 10,
    surveyPostTaskFormSeconds: 240,
  },
  forms: {
    surveyBaseline:
      "https://docs.google.com/forms/d/e/1FAIpQLSfwXS4vgz9DYN5cqy4TK3xe8BmVqNFEnBwxdL2pHy8rB0-Xxw/viewform?embedded=true",
    surveyPostTask:
      "https://docs.google.com/forms/d/e/1FAIpQLSclo1hFxkItDj6Mgz93Ai8P3pKJPMrHB_nL068SWcHgO26UBQ/viewform?embedded=true",
  },
  task1: {
    title: "Verbal-Semantic Task",
    introTitle: "Welcome to the Verbal-Semantic Task",
    introBody:
      "You will hear short audio statements. Decide whether each statement contains a semantic inconsistency, no inconsistency, or an inconsistency that is corrected.",
    backgroundAudio: "auditoryBeats/10HzBinauralBeats.mp3",
    audioFiles: Array.from({ length: 10 }, (_, index) => `auditoryText/audio_${index + 1}.mp3`),
    options: [
      "There was an inconsistency in the sentence.",
      "There was no inconsistency in the sentence.",
      "There was an inconsistency in the sentence but it was corrected.",
    ],
  },
  task2: {
    title: "Optical Illusion Task",
    introTitle: "Welcome to the Optical Illusion Task",
    introBody:
      "You will see a sequence of illusion images. Try to identify hidden patterns, objects, or faces before the timer expires.",
    backgroundAudio: "auditoryBeats/40HzBinauralBeats.mp3",
    imageItems: [
      {
        src: "visuospatial/Dog-optical-illusion.jpg",
        prompt: "Find the hidden human face in the picture.",
      },
      {
        src: "visuospatial/faceInCoffeeBean.jpg",
        prompt: "Spot the hidden face in the coffee beans.",
      },
      {
        src: "visuospatial/HiddenTiger.jpg",
        prompt: "Locate the hidden tiger in the image.",
      },
      {
        src: "visuospatial/countPandas.jpg",
        prompt: "There are more than two pandas in this picture. Can you spot them all?",
      },
      {
        src: "visuospatial/countHumanFaces.webp",
        prompt: "Count six or more human faces in the image.",
      },
      {
        src: "visuospatial/ninePeopleFaces2.jpg",
        prompt: "See if you can count nine people in this illusion.",
      },
      {
        src: "visuospatial/horseFaces.webp",
        prompt: "Identify more than ten horse faces in the picture.",
      },
      {
        src: "visuospatial/HowmanyAnimals.webp",
        prompt: "Spot and count eighteen different animals in the image.",
      },
      {
        src: "visuospatial/sixteenFaces.jpg",
        prompt: "Count sixteen faces in the picture.",
      },
      {
        src: "visuospatial/thirteenHiddenFaces.webp",
        prompt: "Find all thirteen hidden faces.",
      },
    ],
    options: [
      "I solved the puzzle.",
      "I could not solve the puzzle.",
      "I am not sure whether there is a solution.",
    ],
  },
};
