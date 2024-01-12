/******************************
Author: Peter Stein aka LinuxGamesTV aka BdMdesigN
Version 0.0.1 2024.01.12
based on the Gemini MDJ-1000 from Joakim Mattson
*******************************/

function GeminiMDJ900() {}

/** Global variables **/

GeminiMDJ900.off = 0x00;
GeminiMDJ900.on = 0x7F;
GeminiMDJ900.SlipEnabled = false;
var LoopRollEnabledVariable = 0;
GeminiMDJ900.VinylModeEnabled = false;

GeminiMDJ900.Channelmessages = {
	"[Channel1]":0x90,
	"[Channel2]":0x91,
	"[Channel3]":0x92,
	"[Channel4]":0x93
}

GeminiMDJ900.LedControl = {
	"cue_indicator" :0x01,
	"beat_active" :0x02,
	"play_indicator" :0x02,
	"scratch2_enable" : 0x03,
	"hotcue_1_enabled" :0x26,
	"hotcue_2_enabled" :0x27,
	"hotcue_3_enabled" :0x28,
	"hotcue_4_enabled" :0x29,
	"reverse" : 0x14,
	"reverseroll" : 0x14,
	"keylock" : 0x13,
	"slip_enabled" : 0x1A,
	"loop_in" : 0x04,
	"loop_out" : 0x05,
	"beatloop_0.125_enabled" : 0x22,
	"beatloop_0.25_enabled" : 0x23,
	"beatloop_0.5_enabled" : 0x24,
	"beatloop_1_enabled" : 0x25,
	"beatloop_2_enabled" : 0x22,
	"beatloop_4_enabled" : 0x23,
	"beatloop_8_enabled" : 0x24,
	"beatloop_16_enabled" : 0x25,
	"vinyl_mode_enabled": 0x19
}

GeminiMDJ900.LoopRollControls = {
0x1E : "beatlooproll_0.125_activate",
0x1F : "beatlooproll_0.25_activate",
0x20 : "beatlooproll_0.5_activate",
0x21 : "beatlooproll_1_activate",
0x22 : "beatlooproll_2_activate",
0x23 : "beatlooproll_4_activate",
0x24 : "beatlooproll_8_activate",
0x25 : "beatlooproll_16_activate"
}
GeminiMDJ900.LoopControls = {
0x1E : "beatloop_0.125_toggle",
0x1F : "beatloop_0.25_toggle",
0x20 : "beatloop_0.5_toggle",
0x21 : "beatloop_1_toggle",
0x22 : "beatloop_2_toggle",
0x23 : "beatloop_4_toggle",
0x24 : "beatloop_8_toggle",
0x25 : "beatloop_16_toggle"
}

GeminiMDJ900.ScratchChannels = {
	"[Channel1]" : 1,
	"[Channel2]" : 2,
	"[Channel3]" : 3,
	"[Channel4]" : 4
}

// Mixxx control arrays
var MixxxChannels = [
"[Channel1]",
"[Channel2]",
"[Channel3]",
"[Channel4]"
];

var MixxxControls = [
"cue_indicator",
"beat_active", //Can be chosen between beat_active and play_indicator
"play_indicator",
"scratch2_enable",
"hotcue_1_enabled",
"hotcue_2_enabled",
"hotcue_3_enabled",
"hotcue_4_enabled",
"reverse",
"reverseroll",
"keylock",
"slip_enabled", //Not used
"loop_in",
"loop_out",
"beatloop_0.125_enabled",
"beatloop_0.25_enabled",
"beatloop_0.5_enabled",
"beatloop_1_enabled",
"beatloop_2_enabled",
"beatloop_4_enabled",
"beatloop_8_enabled",
"beatloop_16_enabled"
];

var BPM_Ranges = [
"0.04", // 4%
"0.08", // 8%
"0.16", // 16%
"0.24", // 24%
"0.50",	// 50%
"0.80", // 80%
"1.0"   // 100%
]

var BPM_Control_Variable = 0;

//engine.getValue("[Channel1]", "rateRange");
var BMP_Range1 = engine.getValue("[Channel1]", "rateRange");
var BMP_Range2 = engine.getValue("[Channel2]", "rateRange");
var BMP_Range3 = engine.getValue("[Channel3]", "rateRange");
var BMP_Range4 = engine.getValue("[Channel4]", "rateRange");

/** Initialize controller **/
GeminiMDJ900.init = function (id){

	for(var i = 1; i <= 225; i++){
		midi.sendShortMsg(0x90, i, 0x7f);
		midi.sendShortMsg(0x91, i, 0x7f);
		midi.sendShortMsg(0x92, i, 0x7f);
		midi.sendShortMsg(0x93, i, 0x7f);
//		midi.sendShortMsg(0x94, i, 0x00);
	}
	
	for(var n = MixxxChannels.length-1; n >=0; n--) {
		for(var i = MixxxControls.length; i >= 0; i--) {
			engine.connectControl(MixxxChannels[n], "cue_indicator", "GeminiMDJ900.SimpleLedControl");
			engine.connectControl(MixxxChannels[n], "play_indicator", "GeminiMDJ900.SimpleLedControl");
			//engine.connectControl(MixxxChannels[n], "beat_active", "GeminiMDJ900.SimpleLedControl");
			engine.connectControl(MixxxChannels[n], "scratch2_enable", "GeminiMDJ900.SimpleLedControl");
			engine.connectControl(MixxxChannels[n], "hotcue_1_enabled", "GeminiMDJ900.SimpleLedControl");
			engine.connectControl(MixxxChannels[n], "hotcue_2_enabled", "GeminiMDJ900.SimpleLedControl");			
			engine.connectControl(MixxxChannels[n], "hotcue_3_enabled", "GeminiMDJ900.SimpleLedControl");
			engine.connectControl(MixxxChannels[n], "hotcue_4_enabled", "GeminiMDJ900.SimpleLedControl");
			engine.connectControl(MixxxChannels[n], "reverse", "GeminiMDJ900.SimpleLedControl");
			engine.connectControl(MixxxChannels[n], "reverseroll", "GeminiMDJ900.SimpleLedControl");
			engine.connectControl(MixxxChannels[n], "keylock", "GeminiMDJ900.SimpleLedControl");
			engine.connectControl(MixxxChannels[n], "slip_enabled", "GeminiMDJ900.SimpleLedControl");
			engine.connectControl(MixxxChannels[n], "loop_in", "GeminiMDJ900.SimpleLedControl");
			engine.connectControl(MixxxChannels[n], "loop_out", "GeminiMDJ900.SimpleLedControl");
			engine.connectControl(MixxxChannels[n], "beatloop_0.125_enabled", "GeminiMDJ900.SimpleLedControl");
			engine.connectControl(MixxxChannels[n], "beatloop_0.25_enabled", "GeminiMDJ900.SimpleLedControl");
			engine.connectControl(MixxxChannels[n], "beatloop_0.5_enabled", "GeminiMDJ900.SimpleLedControl");
			engine.connectControl(MixxxChannels[n], "beatloop_1_enabled", "GeminiMDJ900.SimpleLedControl");
			engine.connectControl(MixxxChannels[n], "beatloop_2_enabled", "GeminiMDJ900.SimpleLedControl");
			engine.connectControl(MixxxChannels[n], "beatloop_4_enabled", "GeminiMDJ900.SimpleLedControl");
			engine.connectControl(MixxxChannels[n], "beatloop_8_enabled", "GeminiMDJ900.SimpleLedControl");
			engine.connectControl(MixxxChannels[n], "beatloop_16_enabled", "GeminiMDJ900.SimpleLedControl");
			engine.trigger(MixxxChannels[n], MixxxControls[i]);
		}
		engine.setValue(MixxxChannels[n], "rateRange", BPM_Ranges[BPM_Control_Variable]);
		engine.connectControl(MixxxChannels[n], "loop_enabled", "GeminiMDJ900.Loop_enableLedControl");	
		midi.sendShortMsg(GeminiMDJ900.Channelmessages[MixxxChannels[n]], GeminiMDJ900.LedControl["slip_enabled"], GeminiMDJ900.off);
		midi.sendShortMsg(GeminiMDJ900.Channelmessages[MixxxChannels[n]], GeminiMDJ900.LedControl["vinyl_mode_enabled"], GeminiMDJ900.off);
	}
}

/** Shutdown controller **/
GeminiMDJ900.shutdown = function (){
	for(var i = 1; i <= 255; i++){
		midi.sendShortMsg(0x90, i, 0x00);
		midi.sendShortMsg(0x91, i, 0x00);
		midi.sendShortMsg(0x92, i, 0x00);
		midi.sendShortMsg(0x93, i, 0x00);
	}
}

/** Simple Controller for basic leds  **/
GeminiMDJ900.SimpleLedControl = function(value, group, control){
		midi.sendShortMsg(GeminiMDJ900.Channelmessages[group], GeminiMDJ900.LedControl[control], value * GeminiMDJ900.on);
}

/** Led control for loop_enable **/
GeminiMDJ900.Loop_enableLedControl = function(value, group, control){
		midi.sendShortMsg(GeminiMDJ900.Channelmessages[group], GeminiMDJ900.LedControl["loop_in"], value * GeminiMDJ900.on);
		midi.sendShortMsg(GeminiMDJ900.Channelmessages[group], GeminiMDJ900.LedControl["loop_out"], value * GeminiMDJ900.on);
}

/** Control for Reverse/Reverseroll**/
GeminiMDJ900.Reverse = function(channel, control, value, status, group){
		if(GeminiMDJ900.SlipEnabled){
			engine.setValue(group, "reverseroll", value * 1);
		
		}
		else if(!GeminiMDJ900.SlipEnabled){
			engine.setValue(group, "reverse", value * 1);
			//Note: When using parameter named "reverse". Mixxx actually don't use it to indicate the state of reverse function. While reverserolling it behaves as expected. This might be programmin error from mixxx development team. I don't know.
		}
}

/** Control for slip/roll enabled**/
GeminiMDJ900.SlipEnabledControl = function(channel, control, value, status, group){
		if(value == GeminiMDJ900.on){
			if(GeminiMDJ900.SlipEnabled){
				GeminiMDJ900.SlipEnabled = false;
				midi.sendShortMsg(GeminiMDJ900.Channelmessages[group], GeminiMDJ900.LedControl["slip_enabled"], GeminiMDJ900.off);
				}	
			else{
				GeminiMDJ900.SlipEnabled = true;
				midi.sendShortMsg(GeminiMDJ900.Channelmessages[group], GeminiMDJ900.LedControl["slip_enabled"], GeminiMDJ900.on);
			}
		}
}

/** Control for beatlooproll on/off **/
GeminiMDJ900.LoopRollEnabledControl = function(channel, control, value, status, group) {
		if(value == GeminiMDJ900.on){
			if(LoopRollEnabledVariable){
				LoopRollEnabledVariable = 0;
				midi.sendShortMsg(GeminiMDJ900.Channelmessages[group], GeminiMDJ900.LedControl["beatloop_2_enabled"], GeminiMDJ900.off);
				midi.sendShortMsg(GeminiMDJ900.Channelmessages[group], GeminiMDJ900.LedControl["beatloop_4_enabled"], GeminiMDJ900.off);
				midi.sendShortMsg(GeminiMDJ900.Channelmessages[group], GeminiMDJ900.LedControl["beatloop_8_enabled"], GeminiMDJ900.off);
				midi.sendShortMsg(GeminiMDJ900.Channelmessages[group], GeminiMDJ900.LedControl["beatloop_16_enabled"], GeminiMDJ900.off);
				}
			else if(!LoopRollEnabledVariable){
				LoopRollEnabledVariable = 1;
				midi.sendShortMsg(GeminiMDJ900.Channelmessages[group], GeminiMDJ900.LedControl["beatloop_2_enabled"], GeminiMDJ900.on);
				midi.sendShortMsg(GeminiMDJ900.Channelmessages[group], GeminiMDJ900.LedControl["beatloop_4_enabled"], GeminiMDJ900.on);
				midi.sendShortMsg(GeminiMDJ900.Channelmessages[group], GeminiMDJ900.LedControl["beatloop_8_enabled"], GeminiMDJ900.on);
				midi.sendShortMsg(GeminiMDJ900.Channelmessages[group], GeminiMDJ900.LedControl["beatloop_16_enabled"], GeminiMDJ900.on);
			}
		}
}

/** Control for beatloop(roll) **/
GeminiMDJ900.BeatloopControl = function(channel, control, value, status, group) {
		if(!LoopRollEnabledVariable && !GeminiMDJ900.SlipEnabled){
			engine.setValue(group, GeminiMDJ900.LoopControls[control],value * GeminiMDJ900.on);	
		}
		else if(LoopRollEnabledVariable && !GeminiMDJ900.SlipEnabled){
			engine.setValue(group, GeminiMDJ900.LoopRollControls[control],value * GeminiMDJ900.on);
			midi.sendShortMsg(GeminiMDJ900.Channelmessages[group], GeminiMDJ900.LedControl["beatloop_2_enabled"], GeminiMDJ900.on);
			midi.sendShortMsg(GeminiMDJ900.Channelmessages[group], GeminiMDJ900.LedControl["beatloop_4_enabled"], GeminiMDJ900.on);
			midi.sendShortMsg(GeminiMDJ900.Channelmessages[group], GeminiMDJ900.LedControl["beatloop_8_enabled"], GeminiMDJ900.on);
			midi.sendShortMsg(GeminiMDJ900.Channelmessages[group], GeminiMDJ900.LedControl["beatloop_16_enabled"], GeminiMDJ900.on);
		}
		else if(GeminiMDJ900.SlipEnabled && !LoopRollEnabledVariable){
			if(engine.getValue(group,"slip_enabled") == 1 && value == GeminiMDJ900.on){
				engine.setValue(group, "slip_enabled", 0);
			}
			else if(engine.getValue(group,"slip_enabled") == 0 && value == GeminiMDJ900.on){
				engine.setValue(group, "slip_enabled", 1);
			}
			engine.setValue(group, GeminiMDJ900.LoopControls[control],value * GeminiMDJ900.on);	
		}
		else if(LoopRollEnabledVariable && GeminiMDJ900.SlipEnabled){
			engine.setValue(group, GeminiMDJ900.LoopRollControls[control],value * GeminiMDJ900.on);
			midi.sendShortMsg(GeminiMDJ900.Channelmessages[group], GeminiMDJ900.LedControl["beatloop_2_enabled"], GeminiMDJ900.on);
			midi.sendShortMsg(GeminiMDJ900.Channelmessages[group], GeminiMDJ900.LedControl["beatloop_4_enabled"], GeminiMDJ900.on);
			midi.sendShortMsg(GeminiMDJ900.Channelmessages[group], GeminiMDJ900.LedControl["beatloop_8_enabled"], GeminiMDJ900.on);
			midi.sendShortMsg(GeminiMDJ900.Channelmessages[group], GeminiMDJ900.LedControl["beatloop_16_enabled"], GeminiMDJ900.on);
		}
}

/** Control for BMP Range **/
GeminiMDJ900.BPM_Range = function(channel, control, value, status, group) {
	if(value == GeminiMDJ900.on){
		BPM_Control_Variable++;
		if(BPM_Control_Variable >= BPM_Ranges.length){BPM_Control_Variable = 0;}
		engine.setValue(group, "rateRange", BPM_Ranges[BPM_Control_Variable]);
	}
}

/** Control for Vinyl mode enabled (on/off) **/
GeminiMDJ900.VinylModeEnabledControl = function(channel, control, value, status, group) {
	if(value == GeminiMDJ900.on){
		if(!GeminiMDJ900.VinylModeEnabled){
			GeminiMDJ900.VinylModeEnabled = true;
			midi.sendShortMsg(GeminiMDJ900.Channelmessages[group], GeminiMDJ900.LedControl["vinyl_mode_enabled"], GeminiMDJ900.on);
			}
		else{
			GeminiMDJ900.VinylModeEnabled = false;
			midi.sendShortMsg(GeminiMDJ900.Channelmessages[group], GeminiMDJ900.LedControl["vinyl_mode_enabled"], GeminiMDJ900.off);
		}
	}
}

/** Control for turning wheel **/
GeminiMDJ900.WheelTurn = function (channel, control, value, status, group) {
		var newvalue = value-64;
		if(engine.getValue(group, "scratch2_enable")){
			engine.setValue(group, "scratch2", newvalue/21);
		}
		else{
			engine.setValue(group, "jog", newvalue/80);
		}	
}

/** Control For Wheel Touch **/
GeminiMDJ900.WheelTouch = function (channel, control, value, status, group) {
	if(GeminiMDJ900.VinylModeEnabled){
		if(value==GeminiMDJ900.on){	//on
			engine.setValue(group,"scratch2_enable", 1);
		}		
		if(value == GeminiMDJ900.off){	//off
			engine.setValue(group,"scratch2_enable", 0);
		}
	}
}
