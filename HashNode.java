// --== CS400 Project One File Header ==--
// Name: Ziqi Shen
// CSL Username: ziqis
// Email: zshen266@wisc.edu
// Lecture #: LEC002 TR 1:00pm
// Notes to Grader: None
/**
 * This class is for grouping together key-value pairs. Add - using as a
 * sentinel value to indicate if index is occupied.
 * 
 * @author Ziqi Shen
 */
public class HashNode<KeyType, ValueType> {
	public KeyType key;
	public ValueType value;
	public boolean using = false; // default false, which means not using

	/**
	 * Constructor for a new HashNode with input pairs 
	 * 
	 * @param inputKey - the key to be stored
	 * @param inputValue - the value to be stored
	 */
	public HashNode(KeyType inputKey, ValueType inputValue) {
		key = inputKey;
		value = inputValue;
		using = true; // if given pairs, this node is been actively using
	}
}
