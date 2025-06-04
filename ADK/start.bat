@echo off
TITLE AI Assistant Hub Startup

echo Starting AI Assistant Hub...

REM Check if Python is installed
python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Python is not installed or not in PATH. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

REM Check if pip is installed
pip --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo pip is not installed or not in PATH. Please install pip.
    pause
    exit /b 1
)

REM Create virtual environment if it doesn't exist
if not exist venv\ (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

REM Start the Flask application
echo Starting Flask application...
python app.py

REM Deactivate virtual environment on exit
call venv\Scripts\deactivate.bat