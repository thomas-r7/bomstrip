# bomstrip
Strips BOM (byte order mark) from files encoded as UTF8-BOM, saving them back in plain UTF8 format.

## Installation

- npm install -g bomstrip

## Usage

bomstrip \<path1 path2 ...> [-o outputPath] [--log]

### Options

_path[n]_: Paths to files or directories to remove BOM from. Files will be edited in place unless -o flag is used. If directory is passed, every file in the directory is considered (including all sub-directories recursively). Can use wildcards depennding on OS (for example _bomstrip *.json_).

_-o outputPath_: Instead of editing files in-place, write them to this path. Will preserve directory structure for nested sub-directories.

_--log_: Log the path of every modified file.