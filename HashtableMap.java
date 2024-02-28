// --== CS400 Project One File Header ==--
// Name: Ziqi Shen
// CSL Username: ziqis
// Email: zshen266@wisc.edu
// Lecture #: LEC002 TR 1:00pm
// Notes to Grader: None

import java.util.NoSuchElementException;

/**
 * This class represents a HashtableMap implementing with a HashNode outer class 
 * for group together key-value pairs. And it uses open addressing with a simple 
 * linear probe to handle hash collisions.
 * 
 * @author Ziqi Shen
 */
public class HashtableMap<KeyType, ValueType> implements MapADT<KeyType, ValueType> {
	protected HashNode<KeyType, ValueType>[] hashNodes; // hash array
	protected int capacity; // total capacity
	protected int numUsed = 0; // number of used in array

	/**
	 * Constructor for a new Hashtable with default capacity 8
	 */
	public HashtableMap() { // with default capacity = 8
		capacity = 8;
		hashNodes = new HashNode[capacity];
	}

	/**
	 * Constructor for a new Hashtable with input capacity 
	 * 
	 * @param capacity of the Hashtable
	 */
	public HashtableMap(int capacity) {
		this.capacity = capacity;
		hashNodes = new HashNode[capacity];
	}

	/**
	 * Calculates absolute value for implementing opening
	 * addressing with a linear probe
	 * 
	 * @param input - data input
	 * @return the absolute value of input
	 */
	private int absval(int input) {
		if (input < 0)
			return -1 * input;
		return input;
	}

	/**
	 * Calculates index value of hash array for implementing opening
	 * addressing with a linear probe
	 * 
	 * @param key - the key value input
	 * @return the index where key locates, or -1 if failed
	 */
	private int linearProbeInsert(KeyType key) {
		int indexOrg = absval(key.hashCode()) % capacity;
		for (int i = 0; i < capacity; i++) {
			int index = (indexOrg + i) % capacity;
			if (hashNodes[index] == null) {
				return index;
			} else if (!hashNodes[index].using) {
				return index;
			}
		}
		System.out.println("linearProbeInsert failed");
		return -1;
	}

	/**
	 * Adds a new key-value pair/mapping to this Hashtabe: adding the key and value
	 * to the hash array. 
	 * 
	 * @param key - the key value input
	 * @param value - the value of key input
	 * @throws IllegalArgumentException when key is null or duplicate of one already stored
	 */
	public void put(KeyType key, ValueType value) throws IllegalArgumentException {
		if (key == null) { // check if key is null
			throw new IllegalArgumentException("Input key cannot be null!");
		}
		for (int i = 0; i < capacity; i++) {
			if (this.hashNodes[i] != null) {
				if (!this.hashNodes[i].using)
					continue;
				if (this.hashNodes[i].key.equals(key)) { // check if key is duplicate
					throw new IllegalArgumentException("Input key cannot be duplicate!");
				}
			}
		}

		int probeIndex = linearProbeInsert(key); // map to this collection
		if (probeIndex != -1) { // check if there is avaliable position
			this.numUsed++;
			this.hashNodes[probeIndex] = new HashNode(key, value); // add a new key-value
		} else {
			System.out.println("Run out of HashArray!");
		}
		// if load factor is greater than 70%, grow the hashtable
		if (((float) this.numUsed / this.capacity) > 0.7 - 0.000001) { // float compensation
			this.growHashTable();
		}
	}
	
	/**
	 *  Helper method to grow hashtable by a factor of two and rehashing
	 */
	private void growHashTable() {
		HashNode<KeyType, ValueType>[] orgNodes;
		orgNodes = hashNodes;
		int oldCapacity = capacity;
		this.capacity = oldCapacity * 2;
		this.hashNodes = new HashNode[this.capacity];
		this.numUsed = 0;
		for (int i = 0; i < oldCapacity; i++) {
			if (orgNodes[i] != null) {
				if (orgNodes[i].using) {
					put(orgNodes[i].key, orgNodes[i].value);
				}
			}
		}
	}
	
	/**
	 * Checks whether a key mapping to a value exists in this Hashtable
	 * 
	 * @param key - the key value input
	 * @return true if the key exists, false otherwise
	 */
	public boolean containsKey(KeyType key) {
		if(key == null) {
			return false;
		}
		int indexOrg = absval(key.hashCode()) % capacity;
		for (int i = 0; i < this.capacity; i++) {
			int index = (indexOrg + i) % this.capacity;
			if (this.hashNodes[index] == null) {
				return false;
			} else {
				if (key.equals(this.hashNodes[index].key) && hashNodes[index].using) {
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * Retrieves the specific value that a key maps to
	 * 
	 * @param key - the key value input
	 * @throws NoSuchElementException if the key is not stored in this Hashtable
	 * @return the specific value, or null if failed
	 */
	public ValueType get(KeyType key) throws NoSuchElementException {
		if (!containsKey(key)) { // check if key is stored
			throw new NoSuchElementException("Input key is not stored in this collection");
		} else {
			int indexOrg = absval(key.hashCode()) % capacity;
			for (int i = 0; i < this.capacity; i++) {
				int index = (indexOrg + i) % this.capacity;
				if (key.equals(this.hashNodes[index].key) && hashNodes[index].using) {
					return this.hashNodes[index].value;
				}
			}
		}
		System.out.println("get failed");
		return null;
	}

	/**
	 * Removes the mapping for a given key from this Hashtable
	 * 
	 * @param key - the key value input
	 * @throws NoSuchElementException if the key is not stored in this Hashtable
	 * @return the value corresponding to the removed key
	 */
	public ValueType remove(KeyType key) throws NoSuchElementException {
		ValueType toBeRemoved = null;
		if (!containsKey(key)) { // check if key is stored
			throw new NoSuchElementException("Input key is not stored in this collection");
		} else {
			int indexOrg = absval(key.hashCode()) % capacity;
			for (int i = 0; i < this.capacity; i++) {
				int index = (indexOrg + i) % this.capacity;
				if (this.hashNodes[index] == null) {
					continue;
				}
				if (key.equals(this.hashNodes[index].key) && hashNodes[index].using) {
					this.numUsed--;
					this.hashNodes[index].using = false;
					toBeRemoved = this.hashNodes[index].value;
					this.hashNodes[index].key = null;
					this.hashNodes[index].value = null;
				}
			}
		}
		return toBeRemoved;
	}
	
	/**
	 * Removes all key-value pairs from this Hashtable
	 */
	public void clear() {
		this.hashNodes = new HashNode[capacity];
		this.numUsed = 0;
	};

	/**
	 * Retrieves the number of keys stored within this Hashtable
	 */
	public int getSize() {
		return numUsed;
	}
	
	/**
	 * Retrieves this Hashtable's capacity (size of its underlying array)
	 */
	public int getCapacity() {
		return capacity;
	}

}
