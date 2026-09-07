# Neuropraxis Neuwied Terminmonitor

Cloud monitor for statutory insurance -> Erstgespräch / Neupatient(in).

- Runs in GitHub Actions every five minutes.
- Sends Telegram only when the booking page no longer reports that no slots exist.
- Never enters patient data and never books an appointment.

Required repository secrets:

- `TELEGRAM_BOT_TOKEN`

The Telegram chat ID is discovered automatically from the latest message sent to the bot.

The workflow can also be started manually from the Actions tab for testing.
