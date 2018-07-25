#!/usr/bin/env node

import * as fs from "fs-extra";
import * as minimist from "minimist";
import * as path from "path";

interface ConvertJob
{
    input: string;
    output: string;
}

/**
 * Entry point.
 * @param args 
 */
async function bomstrip(args: string[])
{
    const parsedArgs = minimist(args);
    const convertJobs: ConvertJob[] = [];

    // Gather files and directories passed in via cmd line
    for (const name of parsedArgs._)
    {
        let fileStats: fs.Stats;
        try
        {
            fileStats = await fs.stat(name);
        }
        catch
        {
            console.warn(`Path '${name}' not found`);
            continue;
        }
        if (fileStats.isDirectory())
        {
            for (const subFile of await findFiles(name))
            {
                convertJobs.push({
                    input: subFile,
                    output: parsedArgs["o"] ? path.join(parsedArgs["o"], path.relative(name, subFile)) : subFile
                });
            }
        }
        else if (fileStats.isFile())
        {
            convertJobs.push({
                input: name,
                output: parsedArgs["o"] ? path.join(parsedArgs["o"], name) : name
            });
        }
    }

    // If nothing was passed to us, assume cwd
    if (convertJobs.length === 0)
    {
        const cwd = process.cwd();
        for (const subFile of await findFiles(cwd))
        {
            convertJobs.push({
                input: subFile,
                output: parsedArgs["o"] ? path.join(parsedArgs["o"], path.relative(cwd, subFile)) : subFile
            });
        }
    }

    await doJobs(convertJobs, parsedArgs["log"]);
}

/**
 * Executes the specified set of convert jobs.
 * @param convertJobs 
 */
async function doJobs(convertJobs: ConvertJob[], logOutput: boolean)
{
    let counter = 0;
    for (const convertJob of convertJobs)
    {
        if (await doJob(convertJob))
        {
            ++counter;
            if (logOutput)
            {
                if (convertJob.input !== convertJob.output)
                {
                    console.log(`${convertJob.input} -> ${convertJob.output}`);
                }
                else
                {
                    console.log(convertJob.input);
                }
            }
        }
    }
    if (counter === 0)
    {
        console.log(`No files found with BOM`);
    }
    else if (counter === 1)
    {
        console.log(`Stripped BOM from ${counter} file`);
    }
    else
    {
        console.log(`Stripped BOM from ${counter} files`);
    }
    return counter;
}

/**
 * Executes the specified single convert job.
 * @param convertJob 
 */
async function doJob(convertJob: ConvertJob)
{
    // Load file content
    let fileBuf: Buffer;
    try
    {
        fileBuf = await fs.readFile(convertJob.input);
    }
    catch
    {
        // File was deleted between the readdir call and now, or permissions error or something, just skip it
        return false;
    }
    
    // Identify BOM
    if (fileBuf.length < 3) { return false; }
    const view = new Uint8Array(fileBuf.buffer);
    if (view[0] === 0xEF && view[1] === 0xBB && view[2] === 0xBF)
    {
        // Has BOM
        const newBuf = fileBuf.slice(3);
        try
        {
            await fs.writeFile(convertJob.output, newBuf);
        }
        catch (err)
        {
            console.error(`Failed to write file to '${convertJob.output}'`);
            console.error(err);
            return false;
        }
        return true;
    }
    else
    {
        // Does not have BOM
        return false;
    }
}

/**
 * Recursively finds all files under the specified path.
 * Path must refer to a directory.
 * @param inputPath 
 */
async function findFiles(inputPath: string)
{
    const files: string[] = [];
    const contents = await fs.readdir(inputPath);
    for (const item of contents)
    {
        const itemPath = path.join(inputPath, item);
        let fileStats: fs.Stats;
        try
        {
            fileStats = await fs.stat(itemPath);
        }
        catch
        {
            // File was deleted between the readdir call and now, or permissions error or something, just skip it
            continue;
        }
        if (fileStats.isDirectory())
        {
            for (const subFile of await findFiles(itemPath))
            {
                files.push(subFile);
            }
        }
        else if (fileStats.isFile())
        {
            files.push(itemPath);
        }
    }
    return files;
}

bomstrip(process.argv.slice(2));
export = bomstrip;