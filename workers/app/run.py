import sys, os

def compiler(file, lang, compileCmd):
    if (os.path.isfile(file)):
        os.system(compileCmd + file)
        if (os.path.isfile('a.out')) or (os.path.isfile('main.class')):
            return 200
        else:
            return 400
    else:
        return 404

def runner(file, testin, testout, timeout, lang, runCmd):
    cmd = runCmd + ' ' + file
    # result = os.system('timeout %s %s < %s > %s' % (timeout, cmd, testin, testout))
    result = os.system('%s < %s > %s' % (cmd, testin, testout))

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
    compiled = True if args[4]=='True' else False
    compileCmd = args[5]
    runCmd = args[6]
    timeout = str(min(10, int(args[3])))

    testin = 'input.txt'
    testout = 'output.txt'

    # Change directory to the temp folder
    os.chdir('./temp/%s/' % folder)

    status = 200
    if compiled:
        status = compiler(file, lang, compileCmd)

    if status == 200:
        status = runner(file, testin, testout, timeout, lang, runCmd)

    codes = { 200:'success', 404:'file not found', 400:'error', 408:'timeout' }
    print(codes[status])

if __name__ == "__main__":
    main(sys.argv)
