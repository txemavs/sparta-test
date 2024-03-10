#!/bin/sh

echo "Starting $ENTRY..."


DjangoInitialization() {

    echo "Bootstrapping Django..."
    source /home/sparta/venv/bin/activate

    #mkdir -p /usr/src/collected/static
    python manage.py collectstatic --no-input
   
    while ! nc -z "db" "5432"; do
        echo "Waiting for PostgreSQL to accept connections..."
        sleep 1
    done
   
    python manage.py flush --no-input
    python manage.py makemigrations
    python manage.py migrate
    
}


# WSGI Django initialization
if [ "$ENTRY" = "WSGI" ]
then
    DjangoInitialization
    
    echo "Django WSGI server started"
    touch START_ASGI
fi

# ASGI Django initialization - 
if [ "$ENTRY" = "ASGI" ]
then
    echo "Waiting for Django..."
    while [ ! -f START_ASGI ]
    do
      sleep 1 #breaks restarting this container 
    done
    echo "Starting Django ASGI server"
    rm START_ASGI
fi



exec "$@"
