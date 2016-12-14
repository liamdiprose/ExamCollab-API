#!/bin/bash

permission_level=3  # admin

myuuid=$(uuidgen)

psql -d api -U postgres -c "INSERT INTO public.users (permission_level, secret_token) VALUES (${permission_level}, '${myuuid}')"

if [[ $? -eq 0 ]] ; then
    echo -e "Your Secret token is: \n${myuuid}"
fi

