#!/bin/bash

# Fix ApiError to AppError
find src -type f -name "*.ts" -exec sed -i 's/ApiError/AppError/g' {} \;

# Fix network config properties
find src -type f -name "*.ts" -exec sed -i 's/minGasLimit/MinGasLimit/g' {} \;
find src -type f -name "*.ts" -exec sed -i 's/minGasPrice/MinGasPrice/g' {} \;
find src -type f -name "*.ts" -exec sed -i 's/gasPerDataByte/GasPerDataByte/g' {} \;

# Make script executable
chmod +x fix-errors.sh 