import * as jspb from 'google-protobuf'



export class AudioFileInfo extends jspb.Message {
  getAudioBuffList(): Array<number>;
  setAudioBuffList(value: Array<number>): AudioFileInfo;
  clearAudioBuffList(): AudioFileInfo;
  addAudioBuff(value: number, index?: number): AudioFileInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AudioFileInfo.AsObject;
  static toObject(includeInstance: boolean, msg: AudioFileInfo): AudioFileInfo.AsObject;
  static serializeBinaryToWriter(message: AudioFileInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AudioFileInfo;
  static deserializeBinaryFromReader(message: AudioFileInfo, reader: jspb.BinaryReader): AudioFileInfo;
}

export namespace AudioFileInfo {
  export type AsObject = {
    audioBuffList: Array<number>;
  };
}

export class ResultSegment extends jspb.Message {
  getText(): string;
  setText(value: string): ResultSegment;

  getStart(): string;
  setStart(value: string): ResultSegment;

  getEnd(): string;
  setEnd(value: string): ResultSegment;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ResultSegment.AsObject;
  static toObject(includeInstance: boolean, msg: ResultSegment): ResultSegment.AsObject;
  static serializeBinaryToWriter(message: ResultSegment, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ResultSegment;
  static deserializeBinaryFromReader(message: ResultSegment, reader: jspb.BinaryReader): ResultSegment;
}

export namespace ResultSegment {
  export type AsObject = {
    text: string;
    start: string;
    end: string;
  };
}

export class AudioSubbedInfo extends jspb.Message {
  getLongText(): string;
  setLongText(value: string): AudioSubbedInfo;

  getSegmentsList(): Array<ResultSegment>;
  setSegmentsList(value: Array<ResultSegment>): AudioSubbedInfo;
  clearSegmentsList(): AudioSubbedInfo;
  addSegments(value?: ResultSegment, index?: number): ResultSegment;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AudioSubbedInfo.AsObject;
  static toObject(includeInstance: boolean, msg: AudioSubbedInfo): AudioSubbedInfo.AsObject;
  static serializeBinaryToWriter(message: AudioSubbedInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AudioSubbedInfo;
  static deserializeBinaryFromReader(message: AudioSubbedInfo, reader: jspb.BinaryReader): AudioSubbedInfo;
}

export namespace AudioSubbedInfo {
  export type AsObject = {
    longText: string;
    segmentsList: Array<ResultSegment.AsObject>;
  };
}

