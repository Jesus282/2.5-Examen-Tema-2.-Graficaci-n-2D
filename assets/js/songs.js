import { tutorialChart } from "./charts/tutorial_chart.js";
import { song1Chart } from "./charts/song1_chart.js";

export const songs = {
    tutorial: {
        name: "Tutorial",
        chart: tutorialChart,
        audio: "../audio/tutorial.mp3",
        offset: 0
    },

    song1: {
        name: "Song 1",
        chart: song1Chart,
        audio: "../audio/song1.m4a",
        offset: 0
    }
};