import curses
import time
import os, sys
import json
import logging

class YXMapper:
    def __init__(self, lines, columns, leftBottom=(0, 0), rightTop=(100, 100)):
        self.lines = lines - 1
        self.columns = columns - 1
        self.leftBottom = leftBottom
        self.rightTop = rightTop
        self.width = self.rightTop[0] - self.leftBottom[0]
        self.height = self.rightTop[1] - self.leftBottom[1]

        self.columns_per_unit = 1.0 * self.columns / self.width
        self.lines_per_unit = 1.0 * self.lines / self.height

    def toYX(self, x, y):
        column = int((x - self.leftBottom[0]) * self.columns_per_unit)
        line = int(self.lines - (y - self.leftBottom[1]) * self.lines_per_unit)
        return (line, column)


def main_loop(window, motionLog):
    border = motionLog["border"]
    logging.debug(repr(border))
    winyx = window.getmaxyx()
    logging.info("winyx: %s" % repr(winyx))
    yxmap = YXMapper(winyx[0], winyx[1],
                     (border["leftBottom"]["x"], border["leftBottom"]["y"]),
                     (border["rightTop"]["x"], border["rightTop"]["y"]));

    for frame in motionLog["frames"]:
        window.clear()
        for obj in frame:
            if obj["type"] == "object":
                l, c = yxmap.toYX(obj["location"]["x"], obj["location"]["y"])
                window.addstr(l, c, "X");
            elif obj["type"] == "line":
                pass
            else:
                logging.warn("Unrecognized type: %s" % obj["type"])
                continue
        window.refresh()

        ch = window.getch()
        if (ch != -1):
            break

        time.sleep(0.03);


if __name__ == "__main__":
    logging.basicConfig(filename="debug.log", level=logging.DEBUG)

    motionLog = None
    with open(sys.argv[1], "r") as f:
        motionLog = json.loads(f.read())

    stdscr = curses.initscr()
    curses.noecho()
    curses.cbreak()
    curses.curs_set(0)
    stdscr.keypad(1)
    stdscr.timeout(0)


    try:
        main_loop(stdscr, motionLog)
    except Exception, ex:
        logging.error(str(ex))

    curses.nocbreak(); stdscr.keypad(0); curses.echo()
    curses.endwin()
