DROP table IF EXISTS favourite;

CREATE TABLE favourite(
id SERIAL PRIMARY KEY,
image_url VARCHAR(256),
title VARCHAR(256),
author VARCHAR(256),
description TEXT,
isbn VARCHAR(256)
);