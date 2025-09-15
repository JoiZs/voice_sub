import logging


class Logger:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        console_handler = logging.StreamHandler()
        file_handler = logging.FileHandler("app.log", encoding="utf-8")
        logging.basicConfig(level=logging.DEBUG, format="{asctime} - {levelname} - {message}", style="{", datefmt="%Y-%m-%d %H:%M")

        if not self.logger.hasHandlers():
           self.logger.addHandler(console_handler) 
           self.logger.addHandler(file_handler) 


    @property
    def log(self):
        return self.logger


logger = Logger().log