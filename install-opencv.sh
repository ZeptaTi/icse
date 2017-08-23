#!/usr/bin/env bash

OPENCV_VERSION="3.1.0"

OPENCV_URL="https://github.com/Itseez/opencv/archive/${OPENCV_VERSION}.zip"
OPENCV_PACKAGE_NAME="opencv-${OPENCV_VERSION}"

PREFIX="${PREFIX:-/usr/local}"
MAKEFLAGS="${MAKEFLAGS:--j 4}"

install_build_dependencies() {
    local build_packages="build-essential git cmake pkg-config"
    local image_io_packages="libjpeg-dev libtiff5-dev libjasper-dev \
                             libpng12-dev"
    local video_io_packages="libavcodec-dev libavformat-dev \
                             libswscale-dev libv4l-dev \
                             libxvidcore-dev libx264-dev"
    local gtk_packages="libgtk2.0-dev"
    local matrix_packages="libatlas-base-dev gfortran"

    sudo apt-get install -y $build_packages $image_io_packages $gtk_packages \
                       $video_io_packages $matrix_packages 
}

download_packages() {
    wget -c -O "${OPENCV_PACKAGE_NAME}.zip" "$OPENCV_URL"
}

unpack_packages() {
    # unzip args:
    # -q = quiet
    # -n = never overwrite existing files
    unzip -q -n "${OPENCV_PACKAGE_NAME}.zip"
}


build() {
    cmake -D CMAKE_BUILD_TYPE=RELEASE \
          -D CMAKE_INSTALL_PREFIX="$PREFIX" \
          -D INSTALL_C_EXMAPLES=ON \
          -D BUILD_EXAMPLES=ON \
          ..
    make ${MAKEFLAGS}
}

install() {
    sudo make install
    sudo ldconfig
}

log() {
    local msg="$1"; shift
    local _color_bold_yellow='\e[1;33m'
    local _color_reset='\e[0m'
    echo -e "\[${_color_bold_yellow}\]${msg}\[${_color_reset}\]"
}

main() {
    log "Installing build dependencies..."
    install_build_dependencies
    log "Downloading OpenCV packages..."
    download_packages
    log "Unpacking OpenCV packages..."
    unpack_packages

    log "Building OpenCV..."

    cd "$OPENCV_PACKAGE_NAME"
    mkdir build
    cd build

    build
    echo "Installing OpenCV..."
    install
}

main
