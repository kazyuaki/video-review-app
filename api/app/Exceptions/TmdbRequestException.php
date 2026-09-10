<?php

namespace App\Exceptions;

use RuntimeException;

/**
 * 外部作品情報API（TMDB）との通信に失敗した場合にスローされる例外。
 */
class TmdbRequestException extends RuntimeException
{
    //
}
