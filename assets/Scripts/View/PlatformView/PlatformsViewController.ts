import Platform from "../../Game/Platform/Platform";
import BaseViewController from "../BaseViewController";
import PlatformView from "./PlatformView";

const { ccclass } = cc._decorator;

@ccclass
export default class PlatformsViewController extends BaseViewController<Platform, PlatformView> {
    protected getViewClass(): { new (): PlatformView } {
        return PlatformView;
    }
}
