#!/usr/bin/env bash

# Error trap and message
set -e
trap 'echo "";echo "";echo "------------------------";echo "FAILED !";echo "------------------------"' ERR

#!/bin/bash
cd "$(dirname "$0")"

echo "------------------------"
echo "CLEAN ././../webapp/static/*"
echo "------------------------"

rm -rf ././../webapp/static/*
