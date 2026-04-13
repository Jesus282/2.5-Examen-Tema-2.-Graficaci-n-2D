import { tutorialChart } from "./charts/tutorial_chart.js";
import { song1Chart } from "./charts/song1_chart.js";
import { azalea_Chart } from "./charts/azalea_chart.js";
import { meitantei_Chart } from "./charts/meitantei_chart.js";
import { idsmile_Chart } from "./charts/idsmile_chart.js";
import { startdash_Chart } from "./charts/startdash_chart.js";

export const songs = {
    tutorial: {
        name: "Tutorial",
        chart: tutorialChart,
        audio: "./audio/songtuto.mp3",
        offset: 0
    },

    song1: {
        name: "Song 1",
        chart: song1Chart,
        audio: "./audio/dokotoban.m4a",
        offset: 0
    },

    song2: {
        name: "Song 1",
        chart: azalea_Chart,
        audio: "./audio/azalea.m4a",
        offset: 0
    },

    song3: {
        name: "Song 1",
        chart: meitantei_Chart,
        audio: "./audio/meitantei.m4a",
        offset: 0
    },

    song4: {
        name: "Song 4",
        chart: idsmile_Chart,
        audio: "./audio/idsmile.m4a",
        offset: 0
    },

    song5: {
        name: "Song 5",
        chart: startdash_Chart,
        audio: "./audio/startdash.m4a",
        offset: 0
    }
};