FROM python:2.7

RUN apt-get update && apt-get install -y ca-certificates

RUN pip install --trusted-host pypi.python.org Flask requests PyYAML

RUN mkdir web
COPY ./ /web

WORKDIR /web

EXPOSE 5555

CMD ["python", "run.py"]
