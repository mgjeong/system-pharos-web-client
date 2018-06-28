FROM python:2.7

RUN update-ca-certificates

ENV http_proxy=
ENV https_proxy=

RUN pip install --trusted-host files.pythonhosted.org --trusted-host pypi.org Flask requests PyYAML

RUN mkdir web
COPY ./ /web

WORKDIR /web

EXPOSE 5555

CMD ["python", "run.py"]
