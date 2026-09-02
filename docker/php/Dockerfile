FROM php:8.4-fpm-bookworm

# Laravelの実行とComposerで使用するパッケージ
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        git \
        curl \
        unzip \
        libzip-dev \
        libicu-dev \
        libonig-dev \
        libpng-dev \
        libjpeg62-turbo-dev \
        libfreetype6-dev \
    && docker-php-ext-configure gd \
        --with-freetype \
        --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo_mysql \
        mbstring \
        bcmath \
        intl \
        zip \
        gd \
        opcache \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Composerを公式イメージからコピー
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# PHP設定をコピー
COPY ./docker/php/php.ini /usr/local/etc/php/php.ini

WORKDIR /var/www

CMD ["php-fpm"]