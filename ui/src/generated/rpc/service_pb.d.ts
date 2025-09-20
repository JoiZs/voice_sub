import * as jspb from 'google-protobuf'



export class AudioFileInfo extends jspb.Message {
  getAudioBuff(): Uint8Array | string;
  getAudioBuff_asU8(): Uint8Array;
  getAudioBuff_asB64(): string;
  setAudioBuff(value: Uint8Array | string): AudioFileInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AudioFileInfo.AsObject;
  static toObject(includeInstance: boolean, msg: AudioFileInfo): AudioFileInfo.AsObject;
  static serializeBinaryToWriter(message: AudioFileInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AudioFileInfo;
  static deserializeBinaryFromReader(message: AudioFileInfo, reader: jspb.BinaryReader): AudioFileInfo;
}

export namespace AudioFileInfo {
  export type AsObject = {
    audioBuff: Uint8Array | string;
  };
}

export class ResultSegment extends jspb.Message {
  getText(): string;
  setText(value: string): ResultSegment;

  getStart(): number;
  setStart(value: number): ResultSegment;

  getEnd(): number;
  setEnd(value: number): ResultSegment;

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
    start: number;
    end: number;
  };
}

export class ResponseInfo extends jspb.Message {
  getEMessage(): ExceptionMessage | undefined;
  setEMessage(value?: ExceptionMessage): ResponseInfo;
  hasEMessage(): boolean;
  clearEMessage(): ResponseInfo;

  getResMessage(): AudioSubbedInfo | undefined;
  setResMessage(value?: AudioSubbedInfo): ResponseInfo;
  hasResMessage(): boolean;
  clearResMessage(): ResponseInfo;

  getResponseOneofCase(): ResponseInfo.ResponseOneofCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ResponseInfo.AsObject;
  static toObject(includeInstance: boolean, msg: ResponseInfo): ResponseInfo.AsObject;
  static serializeBinaryToWriter(message: ResponseInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ResponseInfo;
  static deserializeBinaryFromReader(message: ResponseInfo, reader: jspb.BinaryReader): ResponseInfo;
}

export namespace ResponseInfo {
  export type AsObject = {
    eMessage?: ExceptionMessage.AsObject;
    resMessage?: AudioSubbedInfo.AsObject;
  };

  export enum ResponseOneofCase {
    RESPONSE_ONEOF_NOT_SET = 0,
    E_MESSAGE = 1,
    RES_MESSAGE = 2,
  }
}

export class ExceptionMessage extends jspb.Message {
  getError(): string;
  setError(value: string): ExceptionMessage;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExceptionMessage.AsObject;
  static toObject(includeInstance: boolean, msg: ExceptionMessage): ExceptionMessage.AsObject;
  static serializeBinaryToWriter(message: ExceptionMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExceptionMessage;
  static deserializeBinaryFromReader(message: ExceptionMessage, reader: jspb.BinaryReader): ExceptionMessage;
}

export namespace ExceptionMessage {
  export type AsObject = {
    error: string;
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

