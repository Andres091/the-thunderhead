import tensorflow
import os
import requests
from textgenrnn import textgenrnn

textgen = textgenrnn()

textgen_2 = textgenrnn('commands/__ai__/textgenrnn_weights.hdf5')
generated_text = textgen_2.generate(30, temperature=1, progress=False, return_as_list=True)
to_write_to_file = "\n".join(generated_text)
print(to_write_to_file)
