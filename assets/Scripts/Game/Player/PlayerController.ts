import BaseController from "../BaseController";
import Player from "./Player";


export default class PlayerController extends BaseController<Player> {
    
    public playerWidth: number = 0.05;
    private currentPlayer: Player;
    private _looseTween: cc.Tween<Player>;
    public get looseTween(): cc.Tween<Player> {
        return this._looseTween;
    }

    constructor() {
        super(() => new Player());
    }

    public resetWithPosition(position: number): void {
        super.reset();
        this.currentPlayer = this.getNextObject();
        this.setupPlayer(this.currentPlayer, position);
    }

    public getMovementTween(distance: number, speed: number): cc.Tween<Player> {
        distance = Math.min(Math.max(distance, this.playerWidth), 1);
        return cc.tween(this.currentPlayer)
            .by(distance / speed, { position: cc.v2(distance, 0) });
    }

    private setupPlayer(player: Player, position: number): void {
        player.position = cc.v2(position - this.playerWidth / 2, 0);
        player.width = this.playerWidth;
        player.isMirrored = false;
        player.isVisible = true;

        this._looseTween = cc.tween(player)
            .by(1, { position: cc.v2(0, -1) });
    }
}
