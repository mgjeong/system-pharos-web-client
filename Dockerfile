FROM python:2.7 

RUN pip install --trusted-host pypi.python.org Flask requests PyYAML

RUN mkdir web
COPY ./ /web

WORKDIR /web

EXPOSE 5555

CMD ["python", "run.py"]
