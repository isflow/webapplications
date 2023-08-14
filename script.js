/** 2023/08/14 Sumomo culture's **/
const { SHA256, MD5 } = CryptoJS;
let hashedEmails = [];
let displayedResults = 10;
let algorithm = '';
let uploadedFileName = '';
const instructionsElement = document.getElementById('instructions');

function handleFileUpload(input) {
    const uploadMessage = document.getElementById('uploadMessage');
    const uploadedFileNameElement = document.getElementById('uploadedFileName');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');

    if (input.files.length > 0) {
        const file = input.files[0];
        uploadedFileName = file.name; // 업로드한 파일명 저장

        uploadMessage.style.display = 'block';
        uploadedFileNameElement.textContent = `Uploaded File: ${uploadedFileName}`;
        progressContainer.style.display = 'block';

        const reader = new FileReader();

        reader.onload = function(event) {
            const csvData = event.target.result;
            const lines = csvData.split('\n');
            const totalLines = lines.length;
            let processedLines = 0;

            for (const line of lines) {
                const email = line.trim();
                let hashedEmail = '';

                if (algorithm === 'sha256') {
                    hashedEmail = CryptoJS.SHA256(email).toString();
                } else if (algorithm === 'md5') {
                    hashedEmail = CryptoJS.MD5(email).toString();
                }

                hashedEmails.push(hashedEmail);
                processedLines++;

                // 업로드 상황 게이지 업데이트
                const progressPercentage = (processedLines / totalLines) * 100;
                progressBar.style.width = progressPercentage + '%';
            }

            displayResults();
            document.getElementById('showAllButton').style.display = 'block';
        };

        reader.readAsText(file);
    } else {
        uploadMessage.style.display = 'none';
        uploadedFileNameElement.textContent = ''; // 파일명 초기화
        progressContainer.style.display = 'none';
    }
}
function hashEmails(algorithm) {
    const fileInput = document.getElementById('csv_file');
    hashedEmails = [];

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const csvData = event.target.result;
        const lines = csvData.split('\n');

        for (const line of lines) {
            const email = line.trim();
            let hashedEmail = '';

            if (algorithm === 'sha256') {
                hashedEmail = CryptoJS.SHA256(email).toString();
            } else if (algorithm === 'md5') {
                hashedEmail = CryptoJS.MD5(email).toString();
            }

            hashedEmails.push(hashedEmail);
        }

        displayResults();
        document.getElementById('showAllButton').style.display = 'block';
    };

    reader.readAsText(file);
}
function handleFileUpload(input) {
    const uploadMessage = document.getElementById('uploadMessage');
    if (input.files.length > 0) {
        const fileName = input.files[0].name;
        uploadMessage.textContent = `Uploaded File: ${fileName}`;
        uploadMessage.style.display = 'block';
    } else {
        uploadMessage.style.display = 'none';
    }
}
function displayResults() {
    const hashedEmailList = document.getElementById('hashedEmailList');
    hashedEmailList.innerHTML = '';

    for (let i = 0; i < displayedResults; i++) {
        const hashedEmail = hashedEmails[i];
        if (hashedEmail) {
            const listItem = document.createElement('li');
            listItem.textContent = hashedEmail;
            hashedEmailList.appendChild(listItem);
        }
    }

    if (hashedEmails.length > displayedResults) {
        const remainingCount = hashedEmails.length - displayedResults;
        const listItem = document.createElement('li');
        listItem.textContent = `... and ${remainingCount} more`;
        hashedEmailList.appendChild(listItem);
    }

    const downloadLink = document.getElementById('downloadLink');
    if (hashedEmails.length > 0) {
        const csvContent = hashedEmails.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        downloadLink.href = url;
        downloadLink.download = 'hashed_emails.csv';
        downloadLink.style.display = 'block';
    }
}

function showAllResults() {
    displayedResults = hashedEmails.length;
    displayResults();
    document.getElementById('showAllButton').style.display = 'none';
    document.getElementById('showLessButton').style.display = 'block';
}

function showLessResults() {
    displayedResults = 10;
    displayResults();
    document.getElementById('showAllButton').style.display = 'block';
    document.getElementById('showLessButton').style.display = 'none';
}

// 언어에 따른 주의문구 표시
const languageInstructions = {
    en: 'Please choose a hashing method for upload:<br>1. SHA256 hash of plain text emails (Strongly recommended)<br>2. MD5 hash of plain text emails<br>3. SHA256 hash of previously MD5 hashed emails',
    ja: '顧客のEメールアドレスのハッシュ化は下記3通りの方法でアップロード可能です<br>1. プレーンテキストのEメールのSHA256ハッシュ(推奨)<br>2. プレーンテキストのEメールのMD5ハッシュ<br>3. MD5ハッシュされたEメールのSHA256ハッシュ(上記2の方法に再度1のハッシュ化を行う)<br>※日本ではプレーンテキスト(生のEメールアドレス)をアップロードすることはできません',
    ko: 'Criteo에 업로드가 가능한 이메일주소는 아래와 같습니다.<br>1. 플레인 이메일을 SHA-256로 해쉬한 값(추천)<br>2. 플레인 이메일을 MD5로 해쉬한 값<br>3. MD5로 해쉬한 값을 한번더 SHA-256로 해쉬한 값',
};

// 사용자의 브라우저 언어 가져오기
const userLanguage = navigator.language || navigator.userLanguage;

// 언어에 따른 주의문구 표시
if (userLanguage.startsWith('en-US')) {
    instructionsElement.innerHTML = languageInstructions.en;
} else if (userLanguage.startsWith('ko-KR')) {
    instructionsElement.innerHTML = languageInstructions.ko;
} else {
    instructionsElement.innerHTML = languageInstructions.ja;
}
