import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.edge.options import Options
from selenium.webdriver.edge.service import Service

# 環境変数から認証情報を取得
USER_ID = os.environ.get('USER_ID', 'XXXX')
PASSWORD = os.environ.get('PASSWORD', 'XXXX')

def setup_driver():
    options = Options()
    options.add_argument('--disable-gpu')
    options.add_argument('--disable-extensions')
    options.add_argument('--proxy-server="direct://"')
    options.add_argument('--proxy-bypass-list=*')
    options.add_argument('--start-maximized')

    driver_path = r"driver path"
    service = Service(executable_path=driver_path)
    return webdriver.Edge(service=service, options=options)

def login(driver):
    driver.get("ログインページ")
    driver.find_element(By.NAME, "ID").send_keys(USER_ID)
    driver.find_element(By.NAME, "Pass").send_keys(PASSWORD)
    driver.find_element(By.ID, "login_btn").click()

def navigate_to_reservation(driver):
    driver.find_element(By.XPATH, "//*[@value='技能予約']").click()

def scroll_and_click(driver, scroll_factor, xpath):
    win_height = driver.execute_script("return window.innerHeight")
    top = int(win_height * scroll_factor)
    driver.execute_script(f"window.scrollTo(0, {top})")
    driver.find_element(By.XPATH, xpath).click()

def main():
    driver = setup_driver()
    try:
        login(driver)
        navigate_to_reservation(driver)

        # スクロールとクリックの操作
        scroll_factors = [2.8, 3.4, 4.0, 4.6, 5.0]
        xpaths = [
            "/html/body/div[2]/table[2]/tbody/tr[3]/td[{}]".format(i)
            for i in range(3, 14)
        ]

        for factor, xpath in zip(scroll_factors, xpaths):
            scroll_and_click(driver, factor, xpath)

    except Exception as e:
        print(f"エラーが発生しました: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    main()