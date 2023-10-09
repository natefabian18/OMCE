import * as blessed from "blessed";
import FileManager from "./FileManagerLogic";

// Create a screen object
const screen = blessed.screen({
	smartCSR: true,
	title: "My Blessed CLI App",
});

const fm = new FileManager(process.cwd(), screen);

const parentFolder = blessed.list({
	parent: screen,
	top: "top",
	left: "left",
	width: "33%",
	height: "90%",
	keys: true, // Enable keyboard control
	vi: true, // Enable vi keys (arrow keys for navigation)
	mouse: false, // Enable mouse support
	items: await fm.getParentWorkingDirectory(),
	style: {
		fg: "grey",
		selected: {
			bg: "#333333", // Background color for selected item
			fg: "white", // Text color for selected item
		},
	},
});

const mainFolder = blessed.list({
	parent: screen,
	top: "top",
	left: "center",
	width: "33%",
	height: "90%",
	keys: true, // Enable keyboard control
	vi: true, // Enable vi keys (arrow keys for navigation)
	mouse: true, // Enable mouse support
	items: await fm.getWorkingDirectory(),
	style: {
		selected: {
			bg: "blue", // Background color for selected item
			fg: "white", // Text color for selected item
		},
	},
});

const childFolder = blessed.list({
	parent: screen,
	top: 0,
	right: 0,
	width: "33%",
	height: "90%",
	keys: false, // Enable keyboard control
	vi: false, // Enable vi keys (arrow keys for navigation)
	mouse: false, // Enable mouse support
	items: [],
	style: {
		selected: {
			//bg: "blue", // Background color for selected item
			fg: "white", // Text color for selected item
		},
		focus: {
			bg: "green",
		},
	},
});

const childContents = blessed.textbox({
	parent: screen,
	top: 0,
	right: 0,
	width: "33%",
	height: "90%",
	keys: false,
	vi: false,
	mouse: false,
	content: "",
	hidden: true,
});

fm.setBlessedElements([parentFolder, mainFolder, childFolder], childContents);

// Handle key events
screen.key(["escape", "q", "C-c"], () => {
	process.exit(0);
});

mainFolder.focus();
screen.render();
