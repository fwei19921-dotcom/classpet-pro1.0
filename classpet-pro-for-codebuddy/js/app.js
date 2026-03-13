// ClassPet Pro - 核心应用逻辑

// ==================== 音效管理 ====================


// ==================== UI管理 ====================
class UIManager {
    constructor(dataManager, soundManager, petManager) {
        this.data = dataManager;
        this.sound = soundManager;
        this.pets = petManager;
        this.currentStudentId = null;
        this.petDisplay = new PetDisplayManager(dataManager);
        this.init();
    }

    init() {
        // 清理可能残留的.pet-name-mini元素
        document.querySelectorAll('.pet-name-mini').forEach(el => el.remove());
        this.renderPetGrid();
        this.bindEvents();
        this.updateClassName();
    }

    updateClassName() {
        const classNameElement = document.querySelector('.class-name');
        if (classNameElement) {
            classNameElement.textContent = `🌟 ${this.data.config.className || '三年级一班'}宠物乐园`;
        }

        // 更新欢迎弹窗中的班级名称
        const welcomeClassName = document.getElementById('welcomeClassName');
        if (welcomeClassName) {
            welcomeClassName.textContent = `${this.data.config.className || '三年级一班'} · 宠物养成系统`;
        }
    }

    renderPetGrid() {
        const grid = document.getElementById('petGrid');
        grid.innerHTML = '';

        console.log('开始渲染宠物卡片，学生数量:', this.data.students.length);

        this.data.students.forEach((student, index) => {
            const petDisplay = this.petDisplay.getPetDisplay(student);
            const petInfo = this.petDisplay.getPetInfo(student);
            const bgClass = this.petDisplay.getPetBgClass(student.score);

            const card = document.createElement('div');
            card.className = 'pet-card';
            card.dataset.id = student.id;

            console.log(`渲染第${index + 1}个卡片: ${student.name}, 积分: ${student.score}`);

            card.innerHTML = `
                <div class="pet-image-container ${bgClass}">
                    ${petDisplay.image
                        ? `<img src="${petDisplay.image}" alt="宠物" class="pet-image-custom">`
                        : `<div class="pet-image" style="font-size: 50px;">${petDisplay.emoji}</div>`
                    }
                </div>
                <div class="student-name" style="color: #212529 !important;">${student.name}</div>
                <div class="score-display">${student.score}分</div>
                <div class="stage-badge ${bgClass}">${petInfo ? petInfo.stageName : '蛋'}</div>
            `;

            card.addEventListener('click', () => this.openStudentModal(student.id));
            grid.appendChild(card);
        });

        console.log('宠物卡片渲染完成');
    }

    updatePetCard(studentId) {
        const student = this.data.getStudent(studentId);
        const card = document.querySelector(`.pet-card[data-id="${studentId}"]`);
        if (!card || !student) return;

        const petDisplay = this.petDisplay.getPetDisplay(student);
        const petInfo = this.petDisplay.getPetInfo(student);
        const bgClass = this.petDisplay.getPetBgClass(student.score);

        const imageContainer = card.querySelector('.pet-image-container');
        imageContainer.className = `pet-image-container ${bgClass}`;

        if (petDisplay.image) {
            imageContainer.innerHTML = `<img src="${petDisplay.image}" alt="宠物" class="pet-image-custom">`;
        } else {
            const imageElement = imageContainer.querySelector('.pet-image');
            if (imageElement) {
                imageElement.textContent = petDisplay.emoji;
            } else {
                imageContainer.innerHTML = `<div class="pet-image" style="font-size: 50px;">${petDisplay.emoji}</div>`;
            }
        }

        card.querySelector('.score-display').textContent = `${student.score}分`;

        const badge = card.querySelector('.stage-badge');
        if (badge && petInfo) {
            badge.textContent = petInfo.stageName;
            badge.className = `stage-badge ${bgClass}`;
        }
    }

    openStudentModal(studentId) {
        this.currentStudentId = studentId;
        const student = this.data.getStudent(studentId);
        if (!student) return;

        const stage = this.data.getStage(student.score);
        const nextStage = this.data.getNextStage(student.score);
        const progress = this.data.getProgress(student.score);
        const needScore = this.data.getNeedScore(student.score);

        document.getElementById('detailName').textContent = student.name;
        document.getElementById('detailScore').textContent = student.score;

        // 使用宠物显示系统
        const petDisplay = this.petDisplay.getPetDisplay(student);
        const petDisplayContainer = document.getElementById('detailPetImage').parentElement;

        if (petDisplay.image) {
            petDisplayContainer.innerHTML = `<img src="${petDisplay.image}" alt="宠物" class="pet-image-custom-modal">`;
        } else {
            const petImageElement = document.getElementById('detailPetImage');
            if (petImageElement) {
                petImageElement.textContent = petDisplay.emoji;
                petDisplayContainer.className = `pet-display ${stage.bgClass}`;
            } else {
                petDisplayContainer.innerHTML = `<div class="pet-emoji-modal">${petDisplay.emoji}</div>`;
                petDisplayContainer.className = `pet-display ${stage.bgClass}`;
            }
        }

        document.getElementById('currentStage').textContent = stage.name;
        document.getElementById('nextStage').textContent = nextStage ? nextStage.name : '已满级';
        document.getElementById('progressFill').style.width = `${progress}%`;
        document.getElementById('needScore').textContent = needScore > 0 ? needScore : '0';

        // 奖励列表
        const rewardsList = document.getElementById('rewardsList');
        if (student.rewards && student.rewards.length > 0) {
            rewardsList.innerHTML = student.rewards.map(r =>
                `<span class="reward-item">${r.name}</span>`
            ).join('');
        } else {
            rewardsList.innerHTML = '<span class="no-rewards">暂无奖励</span>';
        }

        // 宠物互动状态
        this.renderPetStatus(student);

        document.getElementById('studentModal').classList.add('active');
        this.sound.playClick();
    }

    closeStudentModal() {
        document.getElementById('studentModal').classList.remove('active');
        this.currentStudentId = null;
    }

    showScoreAnimation(element, delta) {
        const rect = element.getBoundingClientRect();
        const anim = document.createElement('div');
        anim.className = `score-change ${delta > 0 ? 'up' : 'down'}`;
        anim.textContent = delta > 0 ? `+${delta}` : delta;
        anim.style.left = `${rect.left + rect.width / 2}px`;
        anim.style.top = `${rect.top}px`;
        document.body.appendChild(anim);
        
        setTimeout(() => anim.remove(), 1000);
    }

    showCelebration(student, newStage) {
        const modal = document.getElementById('celebrationModal');
        const petDiv = document.getElementById('celebrationPet');
        const textDiv = document.getElementById('celebrationText');

        petDiv.textContent = newStage.emoji;
        petDiv.style.background = `linear-gradient(135deg, ${newStage.color} 0%, white 100%)`;
        textDiv.textContent = `${student.name}的宠物进化成了${newStage.name}！`;

        modal.classList.add('active');
        this.sound.playEvolution();
    }

    bindEvents() {
        // 关闭弹窗
        document.getElementById('closeModal').addEventListener('click', () => this.closeStudentModal());
        document.getElementById('closeRedeem').addEventListener('click', () => {
            document.getElementById('redeemModal').classList.remove('active');
        });
        document.getElementById('btnCelebrate').addEventListener('click', () => {
            document.getElementById('celebrationModal').classList.remove('active');
        });

        // 加减分按钮
        document.querySelectorAll('.btn-score').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const delta = parseInt(e.target.dataset.value);
                this.handleScoreChange(delta);
            });
        });

    // 宠物认养按钮
    document.getElementById('btnAdoption').addEventListener('click', () => {
        console.log('点击认养按钮');
        // 显示认养中心（默认打开第一个学生）
        if (window.ClassPet && window.ClassPet.petAdoption) {
            const firstStudent = this.data.students[0];
            if (firstStudent) {
                window.ClassPet.petAdoption.showAdoptionCenter(firstStudent.id);
                this.sound.playClick();
            }
        } else {
            console.error('认养系统未初始化');
        }
    });

        // 自定义图片按钮
        const customImageBtn = document.getElementById('btnCustomImage');
        if (customImageBtn) {
            customImageBtn.addEventListener('click', () => {
                if (this.currentStudentId) {
                    showCustomImageUpload(this.currentStudentId);
                    this.sound.playClick();
                }
            });
        }

        // 认养宠物按钮
        const adoptPetBtn = document.getElementById('btnAdoptPet');
        if (adoptPetBtn) {
            adoptPetBtn.addEventListener('click', () => {
                console.log('点击认养宠物按钮, 学生ID:', this.currentStudentId);
                if (this.currentStudentId && window.ClassPet && window.ClassPet.petAdoption) {
                    window.ClassPet.petAdoption.showAdoptionCenter(this.currentStudentId);
                    this.sound.playClick();
                    document.getElementById('studentModal').classList.remove('active');
                } else {
                    console.error('无法打开认养中心:', {
                        hasStudentId: !!this.currentStudentId,
                        hasClassPet: !!window.ClassPet,
                        hasPetAdoption: !!(window.ClassPet && window.ClassPet.petAdoption)
                    });
                    alert('请先选择一个学生');
                }
            });
        }

        // 教师模式
        document.getElementById('btnTeacher').addEventListener('click', () => {
            document.getElementById('teacherModal').classList.add('active');
            this.sound.playClick();
        });

        // 音乐开关
        document.getElementById('btnMusic').addEventListener('click', () => {
            const bgm = window.ClassPet ? window.ClassPet.bgm : null;
            if (bgm) {
                const isPlaying = bgm.toggle();
                const btn = document.getElementById('btnMusic');
                btn.textContent = isPlaying ? '🎵 音乐' : '🔇 静音';
                btn.style.opacity = isPlaying ? '1' : '0.5';
            }
        });

        // 音乐上传按钮
        document.getElementById('btnUploadMusic').addEventListener('click', () => {
            document.getElementById('musicUploadModal').classList.add('active');
            this.updateMusicUploadUI();
            this.sound.playClick();
        });

        // 关闭音乐上传弹窗
        document.getElementById('closeMusicUpload').addEventListener('click', () => {
            document.getElementById('musicUploadModal').classList.remove('active');
        });

        // 点击上传区域
        document.getElementById('musicUploadPlaceholder').addEventListener('click', () => {
            document.getElementById('musicInput').click();
        });

        // 文件选择
        document.getElementById('musicInput').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleMusicUpload(file);
            }
        });

        // 保存音乐
        document.getElementById('btnSaveMusic').addEventListener('click', () => {
            const musicInput = document.getElementById('musicInput');
            const file = musicInput.files[0];
            if (file && window.ClassPet && window.ClassPet.audio) {
                window.ClassPet.audio.setCustomMusic(file);
                document.getElementById('musicUploadModal').classList.remove('active');
                alert(`自定义音乐 "${file.name}" 已设置！`);
            }
        });

        // 移除自定义音乐
        document.getElementById('btnRemoveMusic').addEventListener('click', () => {
            if (window.ClassPet && window.ClassPet.audio) {
                window.ClassPet.audio.removeCustomMusic();
                document.getElementById('musicUploadModal').classList.remove('active');
                alert('已恢复默认音乐');
            }
        });

        // 教师模式弹窗按钮
        document.getElementById('btnCancelTeacher').addEventListener('click', () => {
            document.getElementById('teacherModal').classList.remove('active');
            document.getElementById('teacherPassword').value = '';
            document.getElementById('teacherError').style.display = 'none';
        });

        document.getElementById('btnEnterAdmin').addEventListener('click', () => {
            this.checkPassword(document.getElementById('teacherPassword').value);
        });

        // 密码输入框支持回车键
        document.getElementById('teacherPassword').addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                this.checkPassword(e.target.value);
            }
        });

        // 兑换奖励
        document.getElementById('btnRedeem').addEventListener('click', () => {
            this.openRedeemModal();
        });

        // 宠物互动按钮
        document.querySelectorAll('.btn-interact').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handlePetInteraction(action);
            });
        });

        // 点击弹窗外部关闭
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal && !modal.classList.contains('celebration')) {
                    modal.classList.remove('active');
                }
            });
        });
    }

    handleScoreChange(delta) {
        if (!this.currentStudentId) return;

        const result = this.data.updateScore(this.currentStudentId, delta);
        if (!result) return;

        // 更新UI
        document.getElementById('detailScore').textContent = result.newScore;
        this.updatePetCard(this.currentStudentId);

        // 动画效果
        const scoreValue = document.getElementById('detailScore');
        this.showScoreAnimation(scoreValue, delta);

        // 音效
        if (delta > 0) {
            this.sound.playScoreUp();
        } else {
            this.sound.playScoreDown();
        }

        // 检查进化
        if (result.evolved) {
            setTimeout(() => {
                this.showCelebration(result.student, result.newStage);
                this.openStudentModal(this.currentStudentId);
            }, 500);
        } else {
            // 更新进度条
            const progress = this.data.getProgress(result.newScore);
            const needScore = this.data.getNeedScore(result.newScore);
            document.getElementById('progressFill').style.width = `${progress}%`;
            document.getElementById('needScore').textContent = needScore > 0 ? needScore : '0';
        }
    }



    checkPassword(password) {
        console.log('验证密码:', password, '期望:', this.data.config.teacherPassword);
        const errorElement = document.getElementById('teacherError');
        
        if (password === this.data.config.teacherPassword) {
            // 使用 GameAudio 的可用方法，playRedeem 表示成功
            if (this.sound.playRedeem) {
                this.sound.playRedeem();
            } else if (this.sound.playClick) {
                this.sound.playClick();
            }
            // 隐藏错误提示
            errorElement.style.display = 'none';
            // 关闭弹窗
            document.getElementById('teacherModal').classList.remove('active');
            // 跳转到管理页面
            console.log('密码正确，跳转到 admin.html');
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 300);
        } else {
            // 使用错误音效
            if (this.sound.playError) {
                this.sound.playError();
            } else if (this.sound.playScoreDown) {
                this.sound.playScoreDown();
            }
            // 显示错误提示
            errorElement.style.display = 'block';
            // 清空密码输入框
            document.getElementById('teacherPassword').value = '';
            // 聚焦到密码输入框
            setTimeout(() => {
                document.getElementById('teacherPassword').focus();
            }, 100);
        }
    }

    openRedeemModal() {
        const student = this.data.getStudent(this.currentStudentId);
        if (!student) return;

        const list = document.getElementById('redeemList');
        list.innerHTML = this.data.config.rewards.map(reward => {
            const canAfford = student.score >= reward.cost;
            return `
                <div class="redeem-item ${canAfford ? '' : 'disabled'}">
                    <div class="redeem-info">
                        <span class="redeem-name">${reward.name}</span>
                        <span class="redeem-cost">${reward.cost}分</span>
                    </div>
                    <button class="btn-redeem-item" ${canAfford ? '' : 'disabled'} 
                            data-id="${reward.id}">
                        ${canAfford ? '兑换' : '积分不足'}
                    </button>
                </div>
            `;
        }).join('');

        // 绑定兑换按钮
        list.querySelectorAll('.btn-redeem-item:not(:disabled)').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const rewardId = parseInt(e.target.dataset.id);
                this.handleRedeem(rewardId);
            });
        });

        document.getElementById('redeemModal').classList.add('active');
    }

    handleRedeem(rewardId) {
        const reward = this.data.config.rewards.find(r => r.id === rewardId);
        const student = this.data.getStudent(this.currentStudentId);

        if (!reward || !student || student.score < reward.cost) return;

        // 扣除积分
        student.score -= reward.cost;
        student.rewards.push({
            name: reward.name,
            redeemedAt: Date.now()
        });

        this.data.saveStudents();

        // 更新UI
        this.updatePetCard(this.currentStudentId);
        this.openStudentModal(this.currentStudentId);
        document.getElementById('redeemModal').classList.remove('active');

        this.sound.playSuccess();
        alert(`兑换成功！${student.name}获得了${reward.name}`);
    }

    // 渲染宠物状态
    renderPetStatus(student) {
        const statusBar = document.getElementById('petStatusBar');
        const statusText = document.getElementById('petStatusText');

        if (!student.pet || !student.pet.stats) {
            statusBar.innerHTML = '<p style="text-align: center; color: #999;">暂无宠物状态数据</p>';
            statusText.innerHTML = '<p style="text-align: center; color: #999;">通过互动来培养宠物吧！</p>';
            return;
        }

        const { hunger, happiness, energy } = student.pet.stats;
        const statusInfo = this.data.getPetStatusText(student);

        statusBar.innerHTML = `
            <div class="status-bar-item">
                <span class="status-label">🍽️ 饱食</span>
                <div class="status-progress">
                    <div class="status-fill status-hunger" style="width: ${hunger}%"></div>
                </div>
                <span class="status-value">${hunger}%</span>
            </div>
            <div class="status-bar-item">
                <span class="status-label">😊 开心</span>
                <div class="status-progress">
                    <div class="status-fill status-happiness" style="width: ${happiness}%"></div>
                </div>
                <span class="status-value">${happiness}%</span>
            </div>
            <div class="status-bar-item">
                <span class="status-label">⚡ 精力</span>
                <div class="status-progress">
                    <div class="status-fill status-energy" style="width: ${energy}%"></div>
                </div>
                <span class="status-value">${energy}%</span>
            </div>
        `;

        statusText.innerHTML = `
            <div class="status-badge ${statusInfo.urgent ? 'urgent' : ''}">
                ${statusInfo.status}
            </div>
            <div class="status-advice">${statusInfo.advice}</div>
        `;
    }

    // 处理宠物互动
    handlePetInteraction(action) {
        if (!this.currentStudentId) return;

        const student = this.data.getStudent(this.currentStudentId);
        if (!student) return;

        let result;
        let soundType;

        switch (action) {
            case 'feed':
                result = this.data.feedPet(this.currentStudentId);
                soundType = 'scoreUp';
                break;
            case 'play':
                result = this.data.playWithPet(this.currentStudentId);
                soundType = 'success';
                break;
            case 'rest':
                result = this.data.restPet(this.currentStudentId);
                soundType = 'click';
                break;
            default:
                return;
        }

        if (!result) return;

        // 更新UI
        this.renderPetStatus(result.student);

        // 播放音效
        this.sound[soundType] ? this.sound[soundType]() : this.sound.playClick();

        // 显示反馈
        const actionNames = { feed: '喂食', play: '玩耍', rest: '休息' };
        alert(`${student.name}的宠物${actionNames[action]}成功！`);
    }

    // 更新音乐上传UI
    updateMusicUploadUI() {
        const currentMusicName = document.getElementById('currentMusicName');
        const btnSaveMusic = document.getElementById('btnSaveMusic');
        const btnRemoveMusic = document.getElementById('btnRemoveMusic');
        const placeholder = document.getElementById('musicUploadPlaceholder');

        if (window.ClassPet && window.ClassPet.audio && window.ClassPet.audio.hasCustomMusic()) {
            currentMusicName.textContent = window.ClassPet.audio.getCustomMusicName();
            btnSaveMusic.disabled = true;
            btnRemoveMusic.disabled = false;
            placeholder.innerHTML = `<span>✅</span><p>已设置自定义音乐</p><p class="hint">${window.ClassPet.audio.getCustomMusicName()}</p>`;
        } else {
            currentMusicName.textContent = '默认音乐';
            btnSaveMusic.disabled = true;
            btnRemoveMusic.disabled = true;
        }
    }

    // 处理音乐上传
    handleMusicUpload(file) {
        const currentMusicName = document.getElementById('currentMusicName');
        const btnSaveMusic = document.getElementById('btnSaveMusic');
        const btnRemoveMusic = document.getElementById('btnRemoveMusic');
        const placeholder = document.getElementById('musicUploadPlaceholder');

        // 检查文件类型
        const validTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/x-mpeg-3', 'audio/mpeg3'];
        if (!validTypes.includes(file.type)) {
            alert('请上传音频文件（MP3、WAV、OGG格式）');
            return;
        }

        // 检查文件大小（最大10MB）
        if (file.size > 10 * 1024 * 1024) {
            alert('音乐文件不能超过10MB');
            return;
        }

        currentMusicName.textContent = file.name;
        btnSaveMusic.disabled = false;
        btnRemoveMusic.disabled = false;
        placeholder.innerHTML = `<span>✅</span><p>已选择</p><p class="hint">${file.name}</p>`;
    }
}

// ==================== 设备检测 ====================
function detectDevice() {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const isMobile = window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    return { isTouch, isMobile };
}

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    const device = detectDevice();
    const dataManager = new DataManager();

    // 初始化新的音频系统
    const gameAudio = new GameAudio();
    const bgmManager = new BGMManager(gameAudio);

    // 初始化宠物图片系统（兼容旧代码）
    const petManager = new PetImageManager();

    // 初始化宠物认养系统
    const petAdoption = new PetAdoptionManager(dataManager);

    // 初始化自定义图片上传系统
    const customImageUploader = new PetCustomImageUploader(dataManager);

    // 根据设备类型初始化不同界面
    if (device.isMobile) {
        // 手机端：管理界面
        window.location.href = 'admin.html';
        return;
    }

    // 大屏端：展示界面
    const uiManager = new UIManager(dataManager, gameAudio, petManager);

    // 监听来自管理页面的更新消息
    window.addEventListener('message', (event) => {
        if (event.data.type === 'updateClassName') {
            // 重新加载配置
            dataManager.loadConfig();
            uiManager.updateClassName();
        }
    });

    // 当窗口获得焦点时重新加载配置（从管理页面返回时）
    window.addEventListener('focus', () => {
        dataManager.loadConfig();
        uiManager.updateClassName();
    });

    // 绑定页面点击事件以首次启动音频
    let audioStarted = false;
    const startAudio = () => {
        if (!audioStarted) {
            if (gameAudio.ctx && gameAudio.ctx.state === 'suspended') {
                gameAudio.ctx.resume();
            }
            bgmManager.start();
            audioStarted = true;
            document.removeEventListener('click', startAudio);
            document.removeEventListener('touchstart', startAudio);
        }
    };

    document.addEventListener('click', startAudio);
    document.addEventListener('touchstart', startAudio);

    // 启动背景音乐（会等待用户首次交互）
    bgmManager.start();

    // 暴露到全局供调试
    window.ClassPet = {
        data: dataManager,
        audio: gameAudio,
        bgm: bgmManager,
        pets: petManager,
        petAdoption: petAdoption,
        customImageUploader: customImageUploader,
        ui: uiManager,
        device: device
    };

    console.log('ClassPet Pro 大屏端已加载！');

    // 欢迎弹窗 - 点击进入按钮后启动音乐
    const btnEnter = document.getElementById('btnEnter');
    if (btnEnter) {
        btnEnter.addEventListener('click', () => {
            // 关闭欢迎弹窗
            document.getElementById('welcomeModal').classList.remove('active');

            // 启动背景音乐（首次点击时）
            if (window.ClassPet.bgm && window.ClassPet.bgm.audio) {
                // 恢复音频上下文（如果被挂起）
                if (window.ClassPet.audio.ctx && window.ClassPet.audio.ctx.state === 'suspended') {
                    window.ClassPet.audio.ctx.resume();
                }
                // 直接播放背景音乐
                window.ClassPet.audio.playBackgroundMusic();
                console.log('背景音乐已启动');
            }

            // 播放进入音效
            if (window.ClassPet.audio) {
                window.ClassPet.audio.playClick();
            }
        });
    }

    // 初始化宠物风格选择（保留兼容性）
    initStyleSelection();
});

// ==================== 宠物风格选择 ====================
function initPetStyleSelection() {
    const petSelectModal = document.getElementById('petSelectModal');
    const petStyleGrid = document.getElementById('petStyleGrid');
    
    if (!petSelectModal || !petStyleGrid) return;
    
    // 绑定选择事件
    petStyleGrid.querySelectorAll('.pet-style-option').forEach(option => {
        option.addEventListener('click', () => {
            const style = option.dataset.style;
            selectPetStyle(style);
            
            // 关闭弹窗
            petSelectModal.classList.remove('active');
            
            // 播放音效
            if (window.ClassPet && window.ClassPet.audio) {
                window.ClassPet.audio.playSuccess();
            }
        });
    });
}

function showPetStyleSelection() {
    const petSelectModal = document.getElementById('petSelectModal');
    if (petSelectModal) {
        petSelectModal.classList.add('active');
    }
}

// 页面加载完成后初始化选择功能 - 合并到主初始化中
function initStyleSelection() {
    const petSelectModal = document.getElementById('petSelectModal');
    const petStyleGrid = document.getElementById('petStyleGrid');
    
    if (!petSelectModal || !petStyleGrid) {
        console.log('宠物选择元素未找到，跳过初始化');
        return;
    }
    
    // 绑定选择事件 - 使用事件委托
    petStyleGrid.addEventListener('click', (e) => {
        const option = e.target.closest('.pet-style-option');
        if (!option) return;
        
        const style = option.dataset.style;
        console.log('选择风格:', style);
        
        // 保存选择的风格
        localStorage.setItem('classpet_selected_style', style);
        
        // 更新宠物显示
        if (window.ClassPet && window.ClassPet.pets) {
            window.ClassPet.pets.saveStyle(style);
            if (window.ClassPet.ui && window.ClassPet.ui.renderPetGrid) {
                window.ClassPet.ui.renderPetGrid();
            }
        }
        
        // 关闭弹窗
        petSelectModal.classList.remove('active');
        
        // 播放音效
        if (window.ClassPet && window.ClassPet.audio) {
            window.ClassPet.audio.playSuccess();
        }
        
        // 显示提示
        const styleNames = { cute: '萌宠风', fantasy: '幻想风', pixel: '像素风', scifi: '科幻风', china: '国潮风' };
        alert(`已切换到${styleNames[style] || style}！`);
    });
    
    console.log('宠物风格选择初始化完成');
}


