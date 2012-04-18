#!/bin/bash

FILE_NAME="naver_news_redirector_$1.zip"

cd ..

zip $FILE_NAME * -x */

mv $FILE_NAME release

exit 0
