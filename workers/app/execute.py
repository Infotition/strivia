import sys, os

def compiler(file, lang, compileCmd, outputFile):
    """Compiles the given program and checks, if the compillation was succesfull."""

    # Check if the given code path exists
    if (os.path.isfile(file)):
        # Compile the code with the given command
        os.system(compileCmd + ' ' + file)
        # If compillation created file, everything worked
        if (os.path.isfile(outputFile)):
            return 200
        else:
            return 400
    else:
        return 404

def runner(file, testin, testout, timeout, lang, runCmd):
    """Runs the given compiled/skripted program."""

    # Run the program with the command and input and outputs
    # result = os.system('timeout %s %s < %s > %s' % (timeout, cmd, testin, testout))
    result = os.system('%s < %s > %s' % (runCmd, testin, testout))

    if result == 0:
        return 200
    elif result == 31744:
        return 408
    else:
        return 400

def main(args):
    # Parse information from command line arguments
    source = args[1]
    file = source.split('/')[3]
    folder = source.split('/')[2]

    lang = args[2]
    timeout = str(min(10, int(args[3])))
    compiled = True if args[4]=='true' else False
    compileCmd = args[5]
    runCmd = args[6]
    runFile = args[7]
    outputFile = args[8]

    runCmd += ' ' + runFile

    testin = 'input.txt'
    testout = 'output.txt'

    # Change directory to the temp folder
    os.chdir('./temp/%s/' % folder)

    status = 200

    # Compile the program, if its a compiled language
    if compiled:
        status = compiler(file, lang, compileCmd, outputFile)

    # If compiling was succesfull or not needed, run it
    if status == 200:
        status = runner(file, testin, testout, timeout, lang, runCmd)

    # Parse status codes to generate error
    codes = { 200:'success', 404:'file not found', 400:'error', 408:'timeout' }
    print(codes[status])

if __name__ == "__main__":
    main(sys.argv)
