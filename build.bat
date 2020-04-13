@ECHO off

REM // Validate the first argument
SET ENV=%1
IF NOT DEFINED ENV ( SET ENV="dev" )
IF "%ENV%"=="dev" GOTO StartTasks
IF "%ENV%"=="prod" GOTO StartTasks
ECHO unknown environment parameter. please use "prod" or "dev"(default) only
EXIT /b 1

:StartTasks
ECHO ********************************************************************************
ECHO * Typescript project builder for Windows Developers    by: Adonis Lee Villamor *
ECHO ********************************************************************************
ECHO Executing builder for environment %ENV%

ECHO # Checking dependencies...
ECHO ## Typescript check...
WHERE tsc
IF %ERRORLEVEL% NEQ 0 (
  ECHO Typescript not installed on this machine
  EXIT /b %ERRORLEVEL%
)
ECHO ## Robocopy check...
WHERE robocopy 
IF %ERRORLEVEL% NEQ 0 (
  ECHO Robocopy not installed on this machine
  EXIT /b %ERRORLEVEL%
)
IF "%ENV%"=="prod" (
  ECHO ## Docker check...
  WHERE docker 
  IF %ERRORLEVEL% NEQ 0 (
    ECHO Docker not installed on this machine
    EXIT /b %ERRORLEVEL%
  )
)

IF EXIST dist (
  ECHO Recreating dist folder
  RMDIR dist /S /Q
) ELSE (
  ECHO Creating dist folder
)
ECHO ********************************************************************************
ECHO Compiling typescript to dist folder...
call tsc -p .
IF %ERRORLEVEL% NEQ 0 (
  ECHO Typescript compilation failed... Terminating batch script!
  EXIT /b %ERRORLEVEL%
)

ECHO ********************************************************************************
ECHO Copying static dependencies...
call robocopy src/public dist/src/public /s /e
REM Robocopy returns 0 for no coppies, 1 for success copy, 2 and above for errors
REM See https://ss64.com/nt/robocopy-exit.html
IF %ERRORLEVEL% NEQ 1 (
  ECHO Deploying front-end files failed... Terminating batch script! 
  EXIT /b %ERRORLEVEL%
)



IF "%ENV%"=="prod" (
  SET %ERRORLEVEL%=0
  ECHO ********************************************************************************
  ECHO Building docker image...
  call docker build -t adonisv79/swish-auth .
  IF %ERRORLEVEL% NEQ 0 (
    ECHO ATTAENTION: Please check docker build issues!
  )
)

ECHO ********************************************************************************
ECHO * Build completed! :)                                                          *
ECHO ********************************************************************************
