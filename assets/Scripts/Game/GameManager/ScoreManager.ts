import Label from "../UI/Label";

export default class ScoreManager {
    private _score: number = 0;
    private _collectableScore: number = 0;
    public collectableBuffer: number = 0;
    private _scoreLabel = new Label();
    private _perfectLabel = new Label();
    private _collectableLabel = new Label();
    
    constructor(){
        this._scoreLabel.opacity = 255;
        this._collectableLabel.opacity = 255;
    }
    
    public get score(): number {
        return this._score;
    }
    
    public get collectableScore(): number {
        return this._collectableScore;
    }
    
    public set score(value: number) {
        this._score = value;
        this._scoreLabel.content = value.toString();
    }
    
    public set collectableScore(value: number){
        this._collectableScore = value;
        this._collectableLabel.content = value.toString();
    }
    
    public get collectableLabel() {
        return this._collectableLabel;
    }
    
    public get scoreLabel(): Label {
        return this._scoreLabel;
    }

    public get perfectLabel(): Label {
        return this._perfectLabel;
    }

    public showPerfect() {
        cc.tween(this._perfectLabel)
            .tag(1)
            .to(0.2, { opacity: 255 })
            .delay(0.3)
            .to(0.5, { opacity: 0 })
            .start();
    }

    public reset(){
        this.score = 0;
        this.collectableScore = 0;
        this.collectableBuffer = 0;
        this.perfectLabel.content = "PERFECT";
    }
}