import Label from "../UI/Label";

export default class ScoreManager {
    private _score: number = 0;
    private _scoreLabel = new Label();
    private _perfectLabel = new Label();

    constructor(){
        this._scoreLabel.opacity = 255;
    }

    public get score(): number {
        return this._score;
    }

    public set score(value: number) {
        this._score = value;
        this._scoreLabel.content = value.toString();
    }

    public get scoreLabel(): Label {
        return this._scoreLabel;
    }

    public get perfectLabel(): Label {
        return this._perfectLabel;
    }

    public showPerfect() {
        cc.tween(this._perfectLabel)
            .to(0.2, { opacity: 255 })
            .delay(0.3)
            .to(0.5, { opacity: 0 })
            .start();
    }
}