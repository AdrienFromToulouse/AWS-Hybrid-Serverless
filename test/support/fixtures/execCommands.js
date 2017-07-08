import path from 'path';
import config from '../../../lib/config';
import revision from './revision.json';

const objectKey = 'regions/5f9d71de-a959-4be4-b10b-1fede1b97b25.m4a';
const sample = {
  id: path.basename(objectKey, path.extname(objectKey)),
  fileName: path.basename(objectKey),
  format: 'm4a',
  revisionId: revision.id,
};

const ffmpegExecPath = config.ffmpegExecPath;
const revisionRootPath = path.join(config.downloadRootPath, revision.id);
const inputFile = path.join(revisionRootPath, config.prelude.s3RegionsPrefix, `${sample.id}.${sample.format}`);
const outputFile = path.join(revisionRootPath, config.prelude.s3RegionsPrefix, `${sample.id}.wav`);

const inputWavFile = path.join(revisionRootPath, config.prelude.s3RegionsPrefix, `${sample.id}.wav`);
const output16WavFile = path.join(revisionRootPath, config.prelude.s3RegionsPrefix, `${sample.id}-16tmp.wav`);

const noConvertSampleId = '5f9d71de-a959-4be4-b10b-1fede1b97b25';
const inputNothingFile = path.join(revisionRootPath, config.prelude.s3RegionsPrefix, `${noConvertSampleId}.xxx`);
const outputNothingFile = path.join(revisionRootPath, config.prelude.s3RegionsPrefix, `${noConvertSampleId}.wav`);

const ffmpegCmdPrefix = `${ffmpegExecPath} -loglevel panic -y -i`;
const sampleRate = '-ar 44100';
const stereoOption = '-ac 2';
const monoOption = '';
const ffmpegStereo44100 = `${stereoOption} ${sampleRate}`;
const ffmpegMono44100 = `${monoOption} ${sampleRate}`;
const ffmpegStereo16Bits44100 = '-ac 2 -acodec pcm_s16le -ar 44100';
const ffmpegMono16Bits44100 = `${monoOption} -acodec pcm_s16le ${sampleRate}`;
const ffmpegChannelMapping = '-af "pan=stereo|c0=c0|c1=c1"';

export default class ExecCommands {
  static convertToWav(channels) {
    switch (channels) {
      case 1:
        return `${ffmpegCmdPrefix} ${inputFile} ${ffmpegMono44100}  ${outputFile} && rm -f ${inputFile} || true`;
      case 2:
        return `${ffmpegCmdPrefix} ${inputFile} ${ffmpegStereo44100}  ${outputFile} && rm -f ${inputFile} || true`;
      case 6:
        return `${ffmpegCmdPrefix} ${inputFile} ${ffmpegStereo44100} ${ffmpegChannelMapping} ${outputFile} && rm -f ${inputFile} || true`;
      default:
        return '';
    }
  }

  static ensureAll16BitsDepthWav(channels) {
    switch (channels) {
      case 1:
        return `${ffmpegCmdPrefix} ${inputWavFile} ${ffmpegMono16Bits44100}  ${output16WavFile} && rm -f ${inputWavFile} || true && mv ${output16WavFile} ${inputWavFile} || true`;
      case 2:
        return `${ffmpegCmdPrefix} ${inputWavFile} ${ffmpegStereo16Bits44100}  ${output16WavFile} && rm -f ${inputWavFile} || true && mv ${output16WavFile} ${inputWavFile} || true`;
      case 6:
        return `${ffmpegCmdPrefix} ${inputWavFile} ${ffmpegStereo16Bits44100} ${ffmpegChannelMapping} ${output16WavFile} && rm -f ${inputWavFile} || true && mv ${output16WavFile} ${inputWavFile} || true`;
      default:
        return '';
    }
  }

  static nothingToConvertToWav(channels) {
    switch (channels) {
      case 2:
        return `${ffmpegCmdPrefix} ${inputNothingFile} -ac 2 -ar 44100  ${outputNothingFile} && rm -f ${inputNothingFile} || true`;
      default:
        return '';
    }
  }

  static ffprobeCmd(format) {
    switch (format) {
      case 'wav':
        return `ffprobe ${inputWavFile} -v quiet -show_format -show_streams -of json`;
      default:
        return `ffprobe ${inputFile} -v quiet -show_format -show_streams -of json`;
    }
  }

  static nothingToConvertFfprobeCmd() {
    return `ffprobe ${inputNothingFile} -v quiet -show_format -show_streams -of json`;
  }
}
