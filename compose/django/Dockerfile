FROM python:3.12-alpine
#ENV PYTHONDONTWRITEBYTECODE 1
#ENV PYTHONUNBUFFERED 1
ENV SPARTA=/home/sparta 
ENV FRAMEWORK=$SPARTA/framework
ENV SPARTA_BIN=$SPARTA/venv/bin
RUN mkdir -p $SPARTA
WORKDIR $SPARTA
RUN apk update 
RUN apk add postgresql-client gcc gdal geos graphviz bash
RUN apk add python3-dev postgresql-dev pcre-dev musl-dev geos-dev libffi-dev  openssl-dev 
RUN python3 -m venv venv
RUN echo "source $SPARTA_BIN/activate" >> $SPARTA/.rc 
ENV ENV=$SPARTA/.rc
COPY ./requirements.txt .
RUN $SPARTA_BIN/pip install --upgrade pip
RUN $SPARTA_BIN/pip install uwsgi
RUN $SPARTA_BIN/pip install -r requirements.txt 
WORKDIR $FRAMEWORK
ENTRYPOINT ["/home/sparta/framework/entrypoint.sh"]