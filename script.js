// ========== 注册权限控制逻辑 ==========
var registeredUser = localStorage.getItem("registeredUser");

// 判断当前是否为留言页
if (window.location.pathname.includes("message.html")) {
    var authWarning = document.getElementById("authWarning");
    var userWelcome = document.getElementById("userWelcome");
    var formContainer = document.getElementById("messageFormContainer");
    var listContainer = document.getElementById("messageListContainer");
    var currentUserDisplay = document.getElementById("currentUserDisplay");

    if (registeredUser) {
        // 已注册：显示欢迎栏、留言表单和留言列表，隐藏警告
        authWarning.style.display = "none";
        userWelcome.style.display = "block";
        formContainer.style.display = "block";
        listContainer.style.display = "block";
        currentUserDisplay.innerText = JSON.parse(registeredUser).username;
        
        // 自动填入当前用户的姓名到留言表单
        var msgNameInput = document.getElementById("msgName");
        if (msgNameInput) msgNameInput.value = JSON.parse(registeredUser).username;
    } else {
        // 未注册：显示警告框，隐藏其他内容
        authWarning.style.display = "block";
        userWelcome.style.display = "none";
        formContainer.style.display = "none";
        listContainer.style.display = "none";
    }
}

// ========== 主题切换 ==========
var themeBtn = document.getElementById("themeBtn");
if (themeBtn) {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
        themeBtn.innerHTML = '<i class="fas fa-sun"></i> 浅色';
    }
    themeBtn.onclick = function () {
        document.body.classList.toggle("dark");
        if (document.body.classList.contains("dark")) {
            themeBtn.innerHTML = '<i class="fas fa-sun"></i> 浅色';
            localStorage.setItem("theme", "dark");
        } else {
            themeBtn.innerHTML = '<i class="fas fa-moon"></i> 深色';
            localStorage.setItem("theme", "light");
        }
    };
}

// ========== 留言板功能（localStorage 持久化） ==========
var messageForm = document.getElementById("messageForm");
var messageList = document.getElementById("messageList");
var messages = JSON.parse(localStorage.getItem("messages") || "[]");

function renderMessages() {
    if (!messageList) return;
    messageList.innerHTML = "";

    if (messages.length === 0) {
        messageList.innerHTML = '<p style="color:#999; font-size:14px;">还没有留言，快来抢沙发吧～</p>';
        return;
    }

    for (var i = messages.length - 1; i >= 0; i--) {
        var msg = messages[i];
        var item = document.createElement("div");
        item.className = "message-item";
        item.innerHTML =
            '<div class="msg-avatar">' + msg.name.charAt(0) + '</div>' +
            '<div class="msg-body">' +
                '<p class="msg-meta"><strong>' + msg.name + '</strong> <span>' + msg.time + '</span></p>' +
                '<p>' + msg.content + '</p>' +
            '</div>';
        messageList.appendChild(item);
    }
}

renderMessages();

if (messageForm) {
    messageForm.onsubmit = function (e) {
        e.preventDefault();
        var name = document.getElementById("msgName").value.trim();
        var content = document.getElementById("msgContent").value.trim();

        if (name === "" || content === "") {
            alert("请填写姓名和留言内容！");
            return;
        }

        var now = new Date();
        var timeStr = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + " " + now.getHours() + ":" + (now.getMinutes() < 10 ? "0" : "") + now.getMinutes();

        messages.push({
            name: escapeHtml(name),
            content: escapeHtml(content),
            time: timeStr
        });

        localStorage.setItem("messages", JSON.stringify(messages));
        renderMessages();
        messageForm.reset();
        alert("留言提交成功！刷新后仍会保留。");
    };
}

function escapeHtml(str) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

// ========== 平滑滚动 ==========
var anchors = document.querySelectorAll('a[href^="#"]');
for (var i = 0; i < anchors.length; i++) {
    anchors[i].onclick = function (e) {
        var targetId = this.getAttribute("href");
        if (targetId === "#") return;
        var target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };
}