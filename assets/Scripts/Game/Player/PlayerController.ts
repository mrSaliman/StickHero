import Delegate from "../../Libs/Delegate/Delegate";
import IObjectPool from "../../Libs/ObjectPool/IObjectPool";
import ObjectPool from "../../Libs/ObjectPool/ObjectPool";
import Player from "./Player";

export default class PlayerController {
    public startPlayerPosition: number = 0;
    public nextPlayerPosition: number = 0;
    public distToMoveLast: number = 0;
    movingLeftTime: number = 0.2;
    playerWidth: number = 0.05
    
    private currentPlayer: Player;
    tween: cc.Tween<Player>;
    
    private _playerCreated = new Delegate<[Player]>();
    public get playerCreated() {
        return this._playerCreated;
    }

    private pool: IObjectPool<Player> = new ObjectPool<Player>(() => {
        let player = new Player;
        this._playerCreated.emit(player);
        return player;
    });

    public reset(): void {
        if (this.currentPlayer !== undefined) this.pool.release(this.currentPlayer);
        this.currentPlayer = this.pool.get();
        this.setupPlayer(this.currentPlayer);
    }

    public step(): cc.Tween<Player> {
        return cc.tween(this.currentPlayer)
                    .by(this.movingLeftTime, {position: new cc.Vec2(-this.distToMoveLast, 0)});
    }

    private setupPlayer(player: Player){
        player.position = new cc.Vec2(this.startPlayerPosition - this.playerWidth / 2, 0);
        player.width = this.playerWidth;
        player.isVisible = true;

        this.tween = cc.tween(player)
            .by(2, {position: new cc.Vec2(this.distToMoveLast)})
            .repeatForever();
    }
}