FROM python:2.7

ENV http_proxy 'http://10.112.1.184:8080'
ENV https_proxy 'https://10.112.1.184:8080'

RUN update-ca-certificates

RUN pip install --trusted-host files.pythonhosted.org --trusted-host pypi.org Flask requests PyYAML

RUN mkdir web
COPY ./ /web

WORKDIR /web

EXPOSE 5555

CMD ["python", "run.py"]
