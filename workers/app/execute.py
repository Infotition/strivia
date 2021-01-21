import sys
import os

def compiler(file, compile_cmd, output_file):
    """Compiles the given program and checks, if the compillation was succesfull."""

    #* Check if the given code path exists
    if os.path.isfile(file):
        #* Compile the code with the given command
        os.system(compile_cmd + ' ' + file)
        #* If compillation created file, everything worked
        if os.path.isfile(output_file):
            return 200
        return 400

    return 404

def runner(testin, testout, run_cmd):
    """Runs the given compiled/skripted program."""

    #* Run the program with the command and input and outputs
    # result = os.system('timeout %s %s < %s > %s' % (timeout, cmd, testin, testout))
    result = os.system('%s < %s > %s' % (run_cmd, testin, testout))

    if result == 0:
        return 200
    if result == 31744:
        return 408
    return 400

def main(args):
    #* Parse information from command line arguments
    source = args[1]
    file = source.split('/')[3]
    folder = source.split('/')[2]

    #* lang = args[2]
    #* timeout = str(min(10, int(args[3])))
    compiled = args[4] == 'true'
    compile_cmd = args[5]
    run_cmd = args[6]
    output_file = args[8]

    run_cmd += ' ' + args[7]

    testin = 'input.txt'
    testout = 'output.txt'

    #* Change directory to the temp folder
    os.chdir('./temp/%s' % folder)

    status = 200

    #* Compile the program, if its a compiled language
    if compiled:
        status = compiler(file, compile_cmd, output_file)

    #* If compiling was succesfull or not needed, run it
    if status == 200:
        status = runner(testin, testout, run_cmd)

    #* Parse status codes to generate error
    codes = {200:'success', 404:'file not found', 400:'error', 408:'timeout'}
    print(codes[status])

if __name__ == "__main__":
    main(sys.argv)
