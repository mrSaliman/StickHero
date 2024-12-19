import Delegate from "../../Libs/Delegate/Delegate";
import { GameState } from "./GameManager";

export default class GameStateManager {
    private _currentGameState: GameState = GameState.Prepare;
    private _stateChanged = new Delegate();

    public get currentGameState(): GameState {
        return this._currentGameState;
    }

    public set currentGameState(value: GameState) {
        this._currentGameState = value;
        this._stateChanged.emit();
    }

    public get stateChanged() {
        return this._stateChanged;
    }
}
