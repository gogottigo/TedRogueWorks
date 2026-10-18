# Журнал съёмки

Файлы JS — фактические сценарии сессии съёмки, а не самостоятельные тесты студии.
Они требуют запущенных приложений, браузера и session helpers state.api/openBakery/capture;
root/work должны быть заданы отдельно. Не запускать на рабочей базе пекарни.
Штатный QA fixture из RC6 r1 приложен с исправленным lookup invoice современного payment_attempts.
Состояния создавались поэтапно: seed-bakery → settle-bakery → штатные order.start_preparing/
order.mark_ready → capture-bakery → пересъёмка/выравнивание final-framing.
Отвергнутые кадры в выпуск не включены. Все видимые данные тестовые.
