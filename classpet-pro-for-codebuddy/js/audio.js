// ClassPet Pro - 增强版游戏音效系统

class GameAudio {
    constructor() {
        this.ctx = null;
        this.isPlaying = false;
        this.volume = 0.3;
        this.bgmEnabled = true;
        this.sfxEnabled = true;
        this.init();
    }

    init() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API不支持');
        }
    }

    // ==================== 背景音乐 ====================
    
    // 播放背景音乐
    async playBackgroundMusic() {
        // 恢复音频上下文（如果被浏览器挂起）
        if (this.ctx && this.ctx.state === 'suspended') {
            try {
                await this.ctx.resume();
            } catch (e) {
                console.warn('无法恢复音频上下文:', e);
            }
        }

        // 如果有自定义音乐，优先播放自定义音乐
        if (this.customAudioElement) {
            this.playCustomMusic();
            return;
        }

        // 播放默认背景音乐文件
        if (!this.defaultAudioElement) {
            this.defaultAudioElement = new Audio('assets/audio/background.mp3');
            this.defaultAudioElement.loop = true;
            this.defaultAudioElement.volume = this.volume;
        }

        this.isPlaying = true;

        try {
            await this.defaultAudioElement.play();
            console.log('背景音乐播放成功');
        } catch (error) {
            console.warn('背景音乐播放失败:', error);
            this.isPlaying = false;
        }
    }

    stopBackgroundMusic() {
        this.isPlaying = false;

        // 停止默认背景音乐
        if (this.defaultAudioElement) {
            this.defaultAudioElement.pause();
            this.defaultAudioElement.currentTime = 0;
        }

        // 停止自定义音乐
        if (this.customAudioElement) {
            this.customAudioElement.pause();
            this.customAudioElement.currentTime = 0;
        }
    }

    // 设置自定义音乐
    setCustomMusic(file) {
        this.customMusicFile = file;

        // 停止当前音乐
        this.stopBackgroundMusic();

        // 创建音频元素
        if (this.customAudioElement) {
            this.customAudioElement.remove();
        }

        const url = URL.createObjectURL(file);
        this.customAudioElement = new Audio(url);
        this.customAudioElement.loop = true;
        this.customAudioElement.volume = this.volume;

        this.customAudioElement.addEventListener('ended', () => {
            if (this.isPlaying && this.bgmEnabled) {
                this.customAudioElement.play();
            }
        });

        // 保存到localStorage
        try {
            localStorage.setItem('classpet_custom_music', 'true');
        } catch (e) {
            console.warn('无法保存自定义音乐设置');
        }

        console.log('自定义音乐已设置:', file.name);
    }

    // 移除自定义音乐，使用默认音乐
    removeCustomMusic() {
        this.customMusicFile = null;

        if (this.customAudioElement) {
            this.customAudioElement.pause();
            this.customAudioElement.remove();
            this.customAudioElement = null;
        }

        localStorage.removeItem('classpet_custom_music');
        console.log('已恢复默认音乐');

        // 如果正在播放，重新播放默认音乐
        if (this.isPlaying && this.bgmEnabled) {
            this.playBackgroundMusic();
        }
    }

    // 播放自定义音乐
    playCustomMusic() {
        if (!this.customAudioElement || !this.isPlaying || !this.bgmEnabled) return;

        const playPromise = this.customAudioElement.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('自定义音乐播放中');
            }).catch(error => {
                console.warn('自定义音乐播放失败:', error);
                // 回退到默认音乐
            });
        }
    }

    // 检查是否使用了自定义音乐
    hasCustomMusic() {
        return this.customMusicFile !== null;
    }

    // 获取自定义音乐文件名
    getCustomMusicName() {
        return this.customMusicFile ? this.customMusicFile.name : null;
    }

    // ==================== 音效 ====================

    // 加分音效 - 欢快的上升音
    playScoreUp() {
        if (!this.ctx || !this.sfxEnabled) return;
        
        const notes = [
            { freq: 523.25, duration: 0.08 },  // C5
            { freq: 659.25, duration: 0.08 },  // E5
            { freq: 783.99, duration: 0.15 },  // G5
            { freq: 1046.50, duration: 0.25 }, // C6
        ];
        
        this.playArpeggio(notes, 200);
    }

    // 扣分音效 - 低沉的下降音
    playScoreDown() {
        if (!this.ctx || !this.sfxEnabled) return;
        
        const notes = [
            { freq: 392.00, duration: 0.1 },   // G4
            { freq: 349.23, duration: 0.1 },   // F4
            { freq: 329.63, duration: 0.2 },   // E4
        ];
        
        this.playArpeggio(notes, 180);
    }

    // 进化音效 - 胜利号角（更华丽）
    playEvolution() {
        if (!this.ctx || !this.sfxEnabled) return;
        
        // 主音阶
        const mainNotes = [
            { freq: 523.25, duration: 0.1 },   // C5
            { freq: 659.25, duration: 0.1 },   // E5
            { freq: 783.99, duration: 0.1 },   // G5
            { freq: 1046.50, duration: 0.2 },  // C6
            { freq: 0, duration: 0.05 },        // 休止
            { freq: 1046.50, duration: 0.15 }, // C6
            { freq: 1318.51, duration: 0.3 },  // E6
        ];
        
        this.playArpeggio(mainNotes, 160);
        
        // 和弦伴奏
        setTimeout(() => {
            this.playChord([523.25, 659.25, 783.99, 1046.50], 0.5);
        }, 400);
        
        // 装饰音
        setTimeout(() => {
            this.playSparkle();
        }, 600);
    }

    // 兑换奖励音效 - 金币声（更清脆）
    playRedeem() {
        if (!this.ctx || !this.sfxEnabled) return;
        
        const notes = [
            { freq: 880.00, duration: 0.04 },   // A5
            { freq: 1108.73, duration: 0.04 },  // C#6
            { freq: 1318.51, duration: 0.08 },  // E6
            { freq: 0, duration: 0.03 },         // 休止
            { freq: 1318.51, duration: 0.08 },  // E6
            { freq: 1567.98, duration: 0.15 },  // G6
        ];
        
        this.playArpeggio(notes, 240);
    }

    // 点击音效 - 短促清脆
    playClick() {
        if (!this.ctx || !this.sfxEnabled) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = 800;
        
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    // 连击音效 - 递增的快感
    playCombo(combo) {
        if (!this.ctx || !this.sfxEnabled) return;
        
        const baseFreq = 440 + combo * 50;
        const notes = [
            { freq: baseFreq, duration: 0.05 },
            { freq: baseFreq * 1.25, duration: 0.05 },
            { freq: baseFreq * 1.5, duration: 0.1 },
        ];
        
        this.playArpeggio(notes, 200);
    }

    // 错误/失败音效
    playError() {
        if (!this.ctx || !this.sfxEnabled) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.3);
        
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
    }

    // ==================== 辅助方法 ====================

    // 播放琶音
    playArpeggio(notes, tempo) {
        if (!this.ctx) return;
        
        const beatDuration = 60 / tempo;
        let currentTime = this.ctx.currentTime;
        
        notes.forEach(note => {
            if (note.freq > 0) {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                
                osc.type = 'square';
                osc.frequency.value = note.freq;
                
                gain.gain.setValueAtTime(this.volume, currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration);
                
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                
                osc.start(currentTime);
                osc.stop(currentTime + note.duration);
            }
            currentTime += beatDuration * note.duration;
        });
    }

    // 播放和弦
    playChord(frequencies, duration) {
        if (!this.ctx) return;
        
        frequencies.forEach((freq, i) => {
            setTimeout(() => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                
                osc.type = 'triangle';
                osc.frequency.value = freq;
                
                gain.gain.setValueAtTime(this.volume * 0.2, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
                
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                
                osc.start();
                osc.stop(this.ctx.currentTime + duration);
            }, i * 50);
        });
    }

    // 闪烁音效（装饰音）
    playSparkle() {
        if (!this.ctx) return;
        
        const frequencies = [2093.00, 2637.02, 3135.96, 4186.01]; // C7, E7, G7, C8
        
        frequencies.forEach((freq, i) => {
            setTimeout(() => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                
                osc.type = 'sine';
                osc.frequency.value = freq;
                
                gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
                
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                
                osc.start();
                osc.stop(this.ctx.currentTime + 0.3);
            }, i * 80);
        });
    }

    // ==================== 控制方法 ====================

    toggleBGM() {
        this.bgmEnabled = !this.bgmEnabled;
        if (this.bgmEnabled) {
            this.playBackgroundMusic();
        } else {
            this.stopBackgroundMusic();
        }
        return this.bgmEnabled;
    }

    toggleSFX() {
        this.sfxEnabled = !this.sfxEnabled;
        return this.sfxEnabled;
    }

    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
    }
}

// 背景音乐管理器
class BGMManager {
    constructor(audioInstance) {
        this.audio = audioInstance;
        this.enabled = true;
    }

    start() {
        if (this.enabled && this.audio) {
            this.audio.playBackgroundMusic();
        }
    }

    stop() {
        if (this.audio) {
            this.audio.stopBackgroundMusic();
        }
    }

    toggle() {
        return this.audio.toggleBGM();
    }
}

// 导出
window.GameAudio = GameAudio;
window.BGMManager = BGMManager;
