import { readdir, readFile, stat } from "fs/promises";
import * as blessed from "blessed";

export default class FileManager {
	cwd: string;
	ParentDirectory: string;
	ActiveSelection: string;
	ActiveSelectionIndex: number;

	MainScreen: blessed.Widgets.Screen;

	ParentList: blessed.Widgets.ListElement | undefined = undefined;
	MainList: blessed.Widgets.ListElement | undefined = undefined;
	ChildList: blessed.Widgets.ListElement | undefined = undefined;
	ChildContents: blessed.Widgets.TextboxElement | undefined = undefined;

	constructor(InitDirectory: string, screen: blessed.Widgets.Screen) {
		this.cwd = InitDirectory;
		process.chdir(__dirname);
		console.log(__dirname);
		let directoryArr = __dirname.split("/");
		this.ParentDirectory = directoryArr[directoryArr.length - 1];
		this.MainScreen = screen;

		this.ActiveSelection = "";
		this.ActiveSelectionIndex = 0;

		screen.render();
	}

	async setBlessedElements(
		Elements: Array<blessed.Widgets.ListElement>,
		ChildContent
	) {
		this.ParentList = Elements[0];
		this.MainList = Elements[1];
		this.ChildList = Elements[2];
		this.ChildContents = ChildContent;

		let MainListActive = this.MainList.getItemIndex(this.ActiveSelection);
		let ParentListActive = this.ParentList.getItemIndex(this.ParentDirectory);

		this.ActiveSelectionIndex = MainListActive;

		this.MainList.select(MainListActive);
		this.ParentList.select(ParentListActive);

		this.MainList.key("down", (ch, key) => {
			this.processDownSelect();
		});
		this.MainList.key("up", (ch, key) => {
			this.processUpSelect();
		});
	}

	async getWorkingDirectory() {
		let fileList = await readdir(".");

		this.ActiveSelection = fileList[0];

		return fileList;
	}

	async getParentWorkingDirectory() {
		let fileList = await readdir("..");

		return fileList;
	}

	async getChildWorkingDirectory() {
		let ItemIndex: number = this.MainList.selected;

		let ItemString = this.MainList?.getItem(ItemIndex).getText();

		let itemInQuestion = await stat(`./${ItemString}`);

		if (itemInQuestion.isFile()) {
			console.log("THIS IS A FILE");
			this.ChildList?.hide();
			this.ChildContents?.show();

			let contents = await readFile(`./${ItemString}`);

			this.ChildContents?.setContent(contents.toString());
		} else {
			this.ChildList?.show();
			this.ChildContents?.hide();
			let fileList = await readdir(`./${ItemString}`);
			this.ChildList?.setItems(fileList);
		}

		this.MainScreen.render();
	}

	async processUpSelect() {
		this.getChildWorkingDirectory();
	}

	async processDownSelect() {
		this.getChildWorkingDirectory();
	}

	async processLeftSelect() {}

	async processRightSelect() {}
}
