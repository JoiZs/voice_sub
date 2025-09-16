from google.protobuf.internal import containers as _containers
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from collections.abc import Iterable as _Iterable, Mapping as _Mapping
from typing import ClassVar as _ClassVar, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class AudioFileInfo(_message.Message):
    __slots__ = ("audio_buff",)
    AUDIO_BUFF_FIELD_NUMBER: _ClassVar[int]
    audio_buff: _containers.RepeatedScalarFieldContainer[float]
    def __init__(self, audio_buff: _Optional[_Iterable[float]] = ...) -> None: ...

class ResultSegment(_message.Message):
    __slots__ = ("text", "start", "end")
    TEXT_FIELD_NUMBER: _ClassVar[int]
    START_FIELD_NUMBER: _ClassVar[int]
    END_FIELD_NUMBER: _ClassVar[int]
    text: str
    start: str
    end: str
    def __init__(self, text: _Optional[str] = ..., start: _Optional[str] = ..., end: _Optional[str] = ...) -> None: ...

class AudioSubbedInfo(_message.Message):
    __slots__ = ("long_text", "segments")
    LONG_TEXT_FIELD_NUMBER: _ClassVar[int]
    SEGMENTS_FIELD_NUMBER: _ClassVar[int]
    long_text: str
    segments: _containers.RepeatedCompositeFieldContainer[ResultSegment]
    def __init__(self, long_text: _Optional[str] = ..., segments: _Optional[_Iterable[_Union[ResultSegment, _Mapping]]] = ...) -> None: ...
