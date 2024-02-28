import java.util.NoSuchElementException;

// --== CS400 Project One File Header ==--
// Name: Ziqi Shen
// CSL Username: ziqis
// Email: zshen266@wisc.edu
// Lecture #: LEC002 TR 1:00pm
// Notes to Grader: None

/**
 * Tester class for HashtableMap
 * 
 * @author Ziqi Shen
 */
public class HashtableMapTests {
	/**
	 * This is a test method test for get() to check if get() is correctly performed
	 * on small HashTableMap
	 * 
	 * @return true if passed, false otherwise
	 */
	public static boolean test1() {
		// generate a testMap for test1
		HashtableMap<String, String> testMap = new HashtableMap<String, String>(5);
		testMap.put("ant", "thisisant");
		testMap.put("bear", "thisisbear");
		testMap.put("cat", "thisiscat");
		testMap.put("dog", "thisisdog");

		// test case 1, check if exception is thrown
		try {
			testMap.get("human");
			System.out.println("No exception is thrown in test1 case1");
			return false;
		} catch (NoSuchElementException e) {
			// expected behavior
		} catch (Exception e) {
			System.out.println("Wrong exception is thrown in test1 case1");
			return false;
		}

		// test case 2, check get()
		if (!testMap.get("ant").equals("thisisant")) {
			System.out.println("test1 failed");
			return false;
		}

		System.out.println("test1 passed");
		return true;
	}

	/**
	 * This is a test method test for remove() to check if remove() is correctly
	 * performed
	 * 
	 * @return true if passed, false otherwise
	 */
	public static boolean test2() {
		// generate a testMap for test2
		HashtableMap<String, String> testMap = new HashtableMap<String, String>(5);
		testMap.put("ant", "thisisant");
		testMap.put("bear", "thisisbear");
		testMap.put("cat", "thisiscat");
		testMap.put("dog", "thisisdog");

		// test case 1, check if exception is thrown
		try {
			testMap.remove("star");
			System.out.println("No exception is thrown in test2 case1");
			return false;
		} catch (NoSuchElementException e) {
			// expected behavior
		} catch (Exception e) {
			System.out.println("Wrong exception is thrown in test2 case1");
			return false;
		}

		// test case 2, check remove()
		int sizeBeforeRemove = testMap.getSize();
		String removedValue = testMap.remove("bear");
		if (removedValue == null) {
			System.out.println("test2 failed, remove() returned null");
			return false;
		}
		else if (!removedValue.equals("thisisbear")) {
			System.out.println("test2 failed, remove() returned wrong value");
			return false;
		}
		int sizeAfterRemove = testMap.getSize();
		if (testMap.containsKey("bear")) {
			System.out.println("test2 failed");
			return false;
		}
		if (sizeBeforeRemove - sizeAfterRemove != 1) {
			System.out.println("test2 failed reduce size");
			return false;
		}
		System.out.println("test2 passed");
		return true;
	}

	/**
	 * This is a test method test to check if get() is correctly performed when hash
	 * collisions
	 * 
	 * @return true if passed, false otherwise
	 */
	public static boolean test3() {
		// generate a testMap for test3
		HashtableMap<String, String> testMap = new HashtableMap<String, String>(5);
		testMap.put("ant", "thisisant");
		testMap.put("bear", "thisisbear");
		testMap.put("cat", "thisiscat");
		testMap.put("dog", "thisisdog");
		testMap.put("eagle", "thisiseagle");

		// test case 1, check if exception is thrown
		try {
			testMap.get("cow");
			System.out.println("No exception is thrown in test3 case1");
			return false;
		} catch (NoSuchElementException e) {
			// expected behavior
		} catch (Exception e) {
			System.out.println("Wrong exception is thrown in test3 case1");
			return false;
		}

		// test case 2, check get()
		if (!testMap.get("eagle").equals("thisiseagle")) {
			System.out.println("test3 failed");
			return false;
		}

		System.out.println("test3 passed");
		return true;
	}

	/**
	 * This is a test method test to check if array grow correctly when capacity
	 * rate over 70%
	 * 
	 * @return true if passed, false otherwise
	 */
	public static boolean test4() {
		// test case 1
		// generate a testMap for test4 case 1
		{
			HashtableMap<String, String> testMap = new HashtableMap<String, String>(5);
			testMap.put("ant", "thisisant");
			testMap.put("bear", "thisisbear");
			testMap.put("cat", "thisiscat");
			int c1 = testMap.getCapacity();
			// add a new key-value to trigger growth
			testMap.put("dog", "thisisdog");
			int c2 = testMap.getCapacity();
			if (c2 == c1 * 2) {
			} else {
				System.out.println("test4 failed");
				return false;
			}
		}

		// test case 2
		// generate a testMap2 for test4 case 2
		{
			HashtableMap<String, String> testMap2 = new HashtableMap<String, String>(5);
			int c0 = testMap2.getCapacity();
			testMap2.put("ant", "thisisant");
			testMap2.put("bear", "thisisbear");
			testMap2.put("cat", "thisiscat");
			// check capacity
			int c1 = testMap2.getCapacity();
			if (c1 == c0) {
			} else {
				System.out.println("test4 failed");
				return false;
			}
			// remove two key-values and then add one key-value
			testMap2.remove("ant");
			testMap2.remove("bear");
			testMap2.put("dog", "thisisdog");
			// check capacity
			int c2 = testMap2.getCapacity();
			if (c2 == c0) {
			} else {
				System.out.println("test4 failed");
				return false;
			}
			// add two new key-values to trigger growth
			testMap2.put("ant", "thisisant");
			testMap2.put("bear", "thisisbear");
			// check capacity
			int c3 = testMap2.getCapacity();
			if (c3 == c0 * 2) {
			} else {
				System.out.println("test4 failed");
				return false;
			}
		}
		System.out.println("test4 passed");
		return true;
	}

	/**
	 * This is a test method test to check if exception thrown correctly when insert
	 * duplicate keys
	 * 
	 * @return true if passed, false otherwise
	 */
	public static boolean test5() {
		// generate a testMap for test5
		HashtableMap<String, String> testMap = new HashtableMap<String, String>(5);
		testMap.put("ant", "thisisant");
		testMap.put("bear", "thisisbear");
		testMap.put("cat", "thisiscat");
		testMap.put("dog", "thisisdog");
		try {
			testMap.put("ant", "thisisant");
			System.out.println("No exception is thrown in test5");
			return false;
		} catch (IllegalArgumentException e) {
			// expected behavior
		} catch (Exception e) {
			System.out.println("Wrong exception is thrown in test5");
			return false;
		}

		System.out.println("test5 passed");
		return true;
	}

	/**
	 * Test if all tests passed
	 *
	 * @param args, not expected to receive any except program name
	 */
	public static void main(String[] args) {
		if (test1() && test2() && test3() && test4() && test5()) {
			System.out.println("all test passed!");
		} else {
			System.out.println("test failed!");
		}
	}
}